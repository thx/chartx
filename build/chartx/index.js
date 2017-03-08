window.Chartx || (Chartx = {
    _charts: ['bar', 'force', 'line', 'map', 'pie', 'planet', 'progress', 'radar', 'scat', 'tree', 'chord', 'venn', 'hybrid', 'funnel', 'cloud' , 'original' , 'sankey', 'plant'],
    instances: {}, //存储所有的图表组件实例
    canvax: null,
    create: {},
    _start: function() {
        var __FILE__, scripts = document.getElementsByTagName("script");
        for (var i = scripts.length - 1; i >= 0; i--) {
            var __F__ = scripts[i].getAttribute("src");
            if (__F__.indexOf("chartx/index") >= 0) {
                __FILE__ = __F__.substr(0, __F__.indexOf("chartx/"));
                break;
            }
        };
        Chartx.path = __FILE__.replace(/(^\s*)|(\s*$)/g, "");
        Chartx._setPackages([{
            name: 'canvax',
            path: Chartx.path + "chartx/lib/"
        } , {
            name: 'chartx',
            path: Chartx.path
        }]);

        //然后就可以Chartx.create.line("el" , data , options).then( function( chart ){  } ) 的方式接入图表
        for (var a = 0, l = Chartx._charts.length; a < l; a++) {
            Chartx[Chartx._charts[a]] = Chartx.create[Chartx._charts[a]] = (function(ctype) {
                return function(el, data, options) {
                    return Chartx._queryChart(ctype, el, data, options);
                }
            })(Chartx._charts[a]);
        };

        Chartx._start = null;
        delete Chartx._start;
    },
    _queryChart: function(name, el, data, options) {

        var id = "_instance_"+name+"_"+ (typeof el == "string" ? el : (new Date().getTime() + "_" + Math.floor(Math.random()*100) + "_" + Math.floor(Math.random()*100)) );
 
        var promise = {
            _thenFn: [],
            then: function(fn) {
                if (this.chart) {
                    _.isFunction(fn) && fn(this.chart);
                    return this;
                };
                this._thenFn.push(fn);
                return this;
            },
            _destroy: false,
            chart: null,
            destroy: function() {
                //console.log("chart destroy!");
                this._destroy = true;
                if ( this.chart ) {
                    this.chart.destroy();
                    delete this.chart;
                    promise = null;
                };
                delete Chartx.instances[id];
            },
            path: null
        };


        var path = "chartx/chart/" + name + "/" + (options.type ? options.type : "index");
        var getChart = function() {
            require([path], function(chartConstructor) {
                if (!promise._destroy) {

                    promise.chart = new chartConstructor(el, data, options);
                    promise.chart.draw();

                    Chartx.instances[id] = promise.chart;
                    promise.chart.on("destroy" , function(){
                        delete Chartx.instances[id];
                    });

                    function _drawEnd(){
                        _.each(promise._thenFn, function(fn) {
                            _.isFunction(fn) && fn(promise.chart);
                        });
                        promise._thenFn = [];
                        promise.path = path;
                    };

                    if( promise.chart.drawEnd ){
                        var __drawEnd = promise.chart.drawEnd;
                        promise.chart.drawEnd = function(){
                            __drawEnd.apply( promise.chart , arguments );
                            _drawEnd();
                        };
                    } else {
                        _drawEnd();
                    };
                    
                } else {
                    //如果require回来的时候发现已经promise._destroy == true了
                    //说明已经其已经不需要创建了，可能宿主环境已经销毁

                }
            });
        };

        //首次使用，需要预加载好canvax。
        if (this.canvax) {
            getChart();
        } else {
            require(["canvax/index"], function(C) {
                this.canvax = C;
                getChart();
            });
        };

        return promise;
    },
    setTheme : function( brandColor , colors ){
        require(["chartx/chart/theme"] , function( theme ){
            colors && (theme.colors = colors);
            brandColor && (theme.brandColor = brandColor);
        })
    },
    _site: {
        local: !!~location.search.indexOf('local'),
        daily: !!~location.search.indexOf('daily'),
        debug: !!~location.search.indexOf('debug'),
        build: !!~location.search.indexOf('build')
    },
    /**
     *@packages array [{name:,path:}]
     */
    _setPackages: function(packages) {
        /*
        ## 通用模块定义
        Universal Module Definition
        兼容 AMD KISSY CMD
        For KISSY 1.4
        http://docs.kissyui.com/1.4/docs/html/guideline/kmd.html
        兼容kissy部分代码来自@墨智在项目中使用的UMD代码
        传送门--> http://gitlab.alibaba-inc.com/mm/zuanshi/blob/master/indexbp.js
        Author @释剑
        @packages 需要UMD重新定义的 包集合[{name:,path:},]
        */
        packages = packages || [];
        /**
         *检查包是否在集合中
         */
        function checkInBackages(id) {
            if (packages.length > 0) {
                for (var i = 0, l = packages.length; i < l; i++) {
                    if (id.indexOf(packages[i].name) == 0) {
                        return true
                    }
                }
            }
        };

        function isArray(obj) {
            return (obj.constructor.toString().indexOf("Array") != -1)
        };

        if (!window.define) {
            if (KISSY) {
                window.define = function(id, dependencies, factory) {
                    // KISSY.add(name?, factory?, deps)
                    function proxy() {
                        var args = [].slice.call(arguments, 1, arguments.length);
                        return factory.apply(window, args)
                    }

                    switch (arguments.length) {
                        case 2:
                            factory = dependencies;
                            dependencies = id;
                            KISSY.add(proxy, {
                                requires: dependencies
                            });
                            break;
                        case 3:
                            KISSY.add(id, proxy, {
                                requires: dependencies
                            });
                            break;
                    }
                };

                window.define.kmd = {}

                if (!window.require) {
                    window.require = function(deps, hander) {
                        function proxy() {
                            var args = [].slice.call(arguments, 1, arguments.length);
                            return hander.apply(window, args)
                        }
                        KISSY.use(isArray(deps) ? deps.join(",") : deps, proxy);
                    };
                }
            }
        }
        if (typeof define == "function" && define.cmd) {
            var cmdDefine = define;
            window.define = function(id, deps, factory) {

                //只有固定的一些包是按照amd规范写的才需要转换。
                //比如canvax项目，是按照amd规范的，但是这个包是给业务项目中去使用的。
                //而这个业务使用seajs规范，所以业务中自己的本身的module肯定是按照seajs来编写的不需要转换

                if (typeof id == "string" && checkInBackages(id)) {
                    //只有canvax包下面的才需要做转换，因为canvax的module是安装amd格式编写的
                    return cmdDefine(id, deps, function(require, exports, module) {
                        var depList = [];
                        for (var i = 0, l = deps.length; i < l; i++) {
                            depList.push(require(deps[i]));
                        }
                        //return factory.apply(window , depList);

                        //其实用上面的直接return也是可以的
                        //但是为了遵循cmd的规范，还是给module的exports赋值
                        module.exports = factory.apply(window, depList);
                    });
                } else {
                    return cmdDefine.apply(window, arguments);
                }
            }
            if (!window.require) {
                window.require = seajs.use;
            }
        }
        if (typeof define == "function" && define.amd) {
            //额，本来就是按照amd规范来开发的，就不需要改造了。
        }

        for (var i = 0, l = packages.length; i < l; i++) {
            var name = packages[i].name.toString();
            var path = packages[i].path;

            if (window.KISSY) {
                if (KISSY.Config.ignorePackageNameInUri) {
                    path += name + "/";
                };
                KISSY.config({
                    packages: [{
                        name: name,
                        path: path,
                        debug: Chartx._site.debug,
                        combine: !Chartx._site.local
                    }]
                });
            };
            /*
            window.KISSY && KISSY.config({ packages: [{
                name    : name,
                path    : path,
                debug   : Chartx._site.debug,
                combine : !Chartx._site.local
            }]
            });
            */



            var packageObj = {};
            packageObj[name] = path;
            if (window.seajs) {
                packageObj[name] = path + name;
                
                seajs.config({
                    paths: packageObj
                });
            }
            if (window.requirejs) {
                packageObj[name] = path + name;
                requirejs.config({
                    paths: packageObj
                });
            }
        }
    }
});

Chartx._start && Chartx._start();

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
                if(this.el){
                    this.el.innerHTML = "";
                    this.el = null;
                };
                this._destroy && this._destroy();
                this.fire("destroy");
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
                var _w = parseInt(this.el.offsetWidth);
                var _h = parseInt(this.el.offsetHeight);
                if( _w == this.width && _h == this.height ) return;
                this.clean();
                this.width = _w;
                this.height = _h;
                this.canvax.resize();
                this.inited = false;
                this.draw({
                    resize : true
                });
                this.inited = true;
            },
            /**
             * reset有两种情况，一是data数据源改变， 一个options的参数配置改变。
             * @param obj {data , options}
             * 这个是最简单粗暴的reset方式，全部叉掉重新画，但是如果有些需要比较细腻的reset，比如
             * line，bar数据变化是在原有的原件上面做平滑的变动的话，需要在各自图表的构造函数中重置该函数
             */
            reset: function(obj) {
                this._reset && this._reset( obj );
                var d = ( this.dataFrame.org || [] );
                if (obj && obj.options) {
                    _.deepExtend(this, obj.options);
                };
                if (obj && obj.data) {
                    d = obj.data;
                };
                d && this.resetData(d);
                this.clean();
                this.canvax.getDomContainer().innerHTML = "";
                this.draw();
            },

            //这个resetData一般会被具体的chart实例给覆盖实现
            resetData: function( data ){
                this.dataFrame = this._initData( data );
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

define(
    "chartx/chart/theme",[
        "chartx/utils/colorformat"
    ],
    function( ColorFormat ){
    	var brandColor = "#ff6600";
        var colors = ["#ff8533","#73ace6","#82d982","#e673ac","#cd6bed","#8282d9","#c0e650","#e6ac73","#6bcded","#73e6ac","#ed6bcd","#9966cc"]
        var Theme = {
            colors : colors,
            brandColor : brandColor
        };
        return Theme;
    }
);

define(
    "chartx/components/anchor/Anchor" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "canvax/shape/Circle"
    ],
    function(Canvax, Line, Circle){
        var Anchor = function(opt){
            this.w = 0;
            this.h = 0;
    
            this.enabled = 0 ; //1,0 true ,false 

            this.xAxis   = {
                lineWidth   : 1,
                fillStyle   : '#0088cf',
                lineType    : "dashed"
            }
            this.yAxis   = {
                lineWidth   : 1,
                fillStyle   : '#0088cf',
                lineType    : "dashed"
            }
            this.node    = {
                enabled     : 1,                 //是否有
                r           : 2,                 //半径 node 圆点的半径
                fillStyle   : '#0088cf',
                strokeStyle : '#0088cf',
                lineWidth   : 2
            }
            this.text    = {
                enabled   : 0,
                fillStyle : "#0088cf"
            }

            this.pos     = {
                x           : 0,
                y           : 0
            }   
            this.cross   = {
                x           : 0,
                y           : 0
            }

            this.sprite  = null;

            this._txt    = null;
            this._circle = null;
            this._xAxis  = null;
            this._yAxis  = null;

            this.init( opt );
        };
    
        Anchor.prototype = {
            init:function( opt ){
                if( opt ){
                    _.deepExtend( this , opt );
                }
    
                this.sprite = new Canvax.Display.Sprite({
                    id : "AnchorSprite"
                });
            },
            draw:function(opt , _xAxis , _yAxis){
                this._xAxis = _xAxis;
                this._yAxis = _yAxis;
                this._initConfig( opt );
                this.sprite.context.x = this.pos.x;
                this.sprite.context.y = this.pos.y;
                if( this.enabled ){ 
                    this._widget();
                } 
            },
            show:function(){
                this.sprite.context.visible = true;
                this._circle.context.visible= true;
                if( this._txt ){
                    this._txt.context.visible = true;
                }
            },
            hide:function(){
                this.sprite.context.visible = false;
                this._circle.context.visible= false;
                if( this._txt ){
                    this._txt.context.visible = false;
                }
            },
            //初始化配置
            _initConfig:function( opt ){
              	if( opt ){
                    _.deepExtend( this , opt );
                }
            },
            resetCross : function( cross ){
                this._xLine.context.yStart = cross.y;
                this._xLine.context.yEnd   = cross.y;
                this._yLine.context.xStart = cross.x;
                this._yLine.context.xEnd   = cross.x;

                var nodepos = this.sprite.localToGlobal( cross );
                this._circle.context.x     = nodepos.x;
                this._circle.context.y     = nodepos.y;

                if(this.text.enabled){
                    var nodepos = this.sprite.localToGlobal( cross );
                    this._txt.context.x = parseInt(nodepos.x);
                    this._txt.context.y = parseInt(nodepos.y);
                    
                    var xd    = this._xAxis.dataSection;
                    var xdl   = xd.length;
                    var xText = parseInt(cross.x / this.w * (xd[ xdl - 1 ] - xd[0]) + xd[0]);

                    var yd    = this._yAxis.dataSection;
                    var ydl   = yd.length;
                    var yText = parseInt( (this.h - cross.y) / this.h * (yd[ ydl - 1 ] - yd[0]) + yd[0]);
                    this._txt.resetText("（X："+xText+"，Y："+yText+"）");

                    if( cross.y <= 20 ){
                        this._txt.context.textBaseline = "top"
                    } else {
                        this._txt.context.textBaseline = "bottom"
                    }
                    if( cross.x <= this._txt.getTextWidth() ){
                        this._txt.context.textAlign    = "left"
                    } else {
                        this._txt.context.textAlign    = "right"
                    }
                }
            },
            _widget:function(){
                var self = this
                self._xLine = new Line({
                    id      : 'x',
                    context : {
                        xStart      : 0,
                        yStart      : self.cross.y,
                        xEnd        : self.w,
                        yEnd        : self.cross.y,
                        lineWidth   : self.xAxis.lineWidth,
                        strokeStyle : self.xAxis.fillStyle,
                        lineType    : self.xAxis.lineType
                    }
                });
                self.sprite.addChild(self._xLine);

                self._yLine = new Line({
                    id      : 'y',
                    context : {
                        xStart      : self.cross.x,
                        yStart      : 0,
                        xEnd        : self.cross.x,
                        yEnd        : self.h,
                        lineWidth   : self.yAxis.lineWidth,
                        strokeStyle : self.yAxis.fillStyle,
                        lineType    : self.yAxis.lineType
                    }
                });
                this.sprite.addChild(self._yLine);

                var nodepos = self.sprite.localToGlobal( self.cross );
                self._circle = new Circle({
                    context : {
                        x           : parseInt(nodepos.x),
                        y           : parseInt(nodepos.y),
                        r           : self._getProp( self.node.r ),
                        fillStyle   : self._getProp( self.node.fillStyle ) || "#ff0000",
                        strokeStyle : self._getProp( self.node.strokeStyle ) || '#cc3300',
                        lineWidth   : self._getProp( self.node.lineWidth ) || 4
                    }
                });
                self.sprite.getStage().addChild(self._circle);

                if(self.text.enabled){
                    self._txt = new Canvax.Display.Text( "" , {
                        context : {
                            x : parseInt(nodepos.x),
                            y : parseInt(nodepos.y),
                            textAlign : "right",
                            textBaseline : "bottom",
                            fillStyle    : self.text.fillStyle
                        }
                    } );
                    self.sprite.getStage().addChild(self._txt);
                }
            },
            _getProp : function( s ){
                if( _.isFunction( s ) ){
                    return s();
                }
                return s
            }           
        };
        return Anchor;
    
    } 
)


define(
    "chartx/components/back/Back" ,
    [
         "canvax/index",
         "canvax/shape/Line",
         "canvax/shape/Rect",
         "chartx/utils/tools"
    ],
    function( Canvax, Line, Rect , Tools){
        var Back = function(opt){
            this.w       = 0;   
            this.h       = 0;
            this.root    = null; //该组件被添加到的目标图表项目，
    
            this.pos     = {
                x : 0,
                y : 0
            }

            this.enabled = 1;
    
            this.xOrigin = {                                //原点开始的x轴线
                    enabled     : 1,
                    lineWidth   : 1,
                    strokeStyle : '#e6e6e6'
            }
            this.yOrigin = {                                //原点开始的y轴线               
                    enabled     : 1,
                    lineWidth   : 1,
                    strokeStyle : '#e6e6e6',
                    biaxial     : false
            }
            this.xAxis   = {                                //x轴上的线
                    enabled     : 1,
                    data        : [],                      //[{y:100},{}]
                    org         : null,                    //x轴坐标原点，默认为上面的data[0]
                    // data     : [{y:0},{y:-100},{y:-200},{y:-300},{y:-400},{y:-500},{y:-600},{y:-700}],
                    lineType    : 'solid',                //线条类型(dashed = 虚线 | '' = 实线)
                    lineWidth   : 1,
                    strokeStyle : '#f0f0f0', //'#e5e5e5',
                    filter      : null 
            }
            this.yAxis = {                                //y轴上的线
                    enabled     : 0,
                    data        : [],                      //[{x:100},{}]
                    xDis        : 0,
                    org         : null,                    //y轴坐标原点，默认为上面的data[0]
                    // data     : [{x:100},{x:200},{x:300},{x:400},{x:500},{x:600},{x:700}],
                    lineType    : 'solid',                      //线条类型(dashed = 虚线 | '' = 实线)
                    lineWidth   : 1,
                    strokeStyle : '#f0f0f0',//'#e5e5e5',
                    filter      : null
            } 
            this.fill = {
                fillStyle : null,
                alpha : null
            }
    
            this.sprite       = null;                       //总的sprite
            this.xAxisSp      = null;                       //x轴上的线集合
            this.yAxisSp      = null;                       //y轴上的线集合

            this.animation = true;
            this.resize = false;
    
            this.init(opt);
        };
    
        Back.prototype = {
    
            init:function(opt){
                _.deepExtend(this , opt); 
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            draw : function(opt , root){
                this.root = root;
                _.deepExtend( this , opt );
                //this._configData(opt);
                this._widget();
                this.setX(this.pos.x);
                this.setY(this.pos.y);
            },
            update : function( opt ){
                this.sprite.removeAllChildren();
                this.draw( opt );
            },
            _widget:function(){
                var self  = this;
                if(!this.enabled){
                    return
                };
                
                if( self.root && self.root._yAxis && self.root._yAxis.dataSectionGroup ){
                    self.yGroupSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yGroupSp);
                    for( var g = 0 , gl=self.root._yAxis.dataSectionGroup.length ; g < gl ; g++ ){
                        var yGroupHeight = self.root._yAxis.yGraphsHeight / gl ;
                        var groupRect = new Rect({
                            context : {
                                x : 0,
                                y : -yGroupHeight * g,
                                width : self.w,
                                height : -yGroupHeight,
                                fillStyle : self.fill.fillStyle || "#000",
                                globalAlpha : self.fill.alpha || 0.025 * (g%2)
                            }
                        });
                        
                        self.yGroupSp.addChild( groupRect );
                    };
                };

                self.xAxisSp   = new Canvax.Display.Sprite(),  self.sprite.addChild(self.xAxisSp);
                self.yAxisSp   = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yAxisSp);
                
   
                //x轴方向的线集合
                var arr = self.xAxis.data;
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a];
                    var line = new Line({
                        id : "back_line_"+a,
                        context : {
                            xStart      : 0,
                            yStart      : o.y,
                            xEnd        : 0,//self.w,
                            yEnd        : o.y,
                            lineType    : self.xAxis.lineType,
                            lineWidth   : self.xAxis.lineWidth,
                            strokeStyle : self.xAxis.strokeStyle  
                        }
                    });
                    if(self.xAxis.enabled){
                        _.isFunction( self.xAxis.filter ) && self.xAxis.filter.apply( line , [{
                            layoutData : self.yAxis.data,
                            index      : a,
                            line       : line
                        } , self]);
                        self.xAxisSp.addChild(line);
                        
                        if( this.animation && !this.resize ){
                            line.animate({
                                xStart : 0,
                                xEnd : self.w
                            } , {
                                duration : 500,
                                //easing : 'Back.Out',//Tween.Easing.Elastic.InOut
                                delay : (al-a) * 80,
                                id : line.id
                            });
                        } else {
                            line.context.xStart = 0;
                            line.context.xEnd = self.w;
                        }


                    };
                };

                //y轴方向的线集合
                var arr = self.yAxis.data
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a]
                    var line = new Line({
                        context : {
                            xStart      : o.x,
                            yStart      : 0,
                            xEnd        : o.x,
                            yEnd        : -self.h,
                            lineType    : self.yAxis.lineType,
                            lineWidth   : self.yAxis.lineWidth,
                            strokeStyle : self.yAxis.strokeStyle,
                            visible     : o.x ? true : false
                        }
                    })
                    if(self.yAxis.enabled){
                        _.isFunction( self.yAxis.filter ) && self.yAxis.filter.apply(line , [{
                            layoutData : self.xAxis.data,
                            index      : a,
                            line       : line
                        } , self ]);
                        self.yAxisSp.addChild(line);
                    }
                };

                //原点开始的y轴线
                var xAxisOrg = (self.yAxis.org == null ? 0 : _.find( self.yAxis.data , function(obj){
                    return obj.content == self.yAxis.org
                } ).x );
            
                //self.yAxis.org = xAxisOrg;
                var line = new Line({
                    context : {
                        xStart      : xAxisOrg,
                        xEnd        : xAxisOrg,
                        yEnd        : -self.h,
                        lineWidth   : self.yOrigin.lineWidth,
                        strokeStyle : self.yOrigin.strokeStyle
                    }
                })
                if(self.yOrigin.enabled)
                    self.sprite.addChild(line)

                if( self.yOrigin.biaxial ){
                    var lineR = new Line({
                        context : {
                            xStart      : self.w,
                            xEnd        : self.w,
                            yEnd        : -self.h,
                            lineWidth   : self.yOrigin.lineWidth,
                            strokeStyle : self.yOrigin.strokeStyle
                        }
                    })
                    if(self.yOrigin.enabled)
                        self.sprite.addChild(lineR)

                }
    
                //原点开始的x轴线
                var yAxisOrg = (self.xAxis.org == null ? 0 : _.find( self.xAxis.data , function(obj){
                    return obj.content == self.xAxis.org
                } ).y );

                //self.xAxis.org = yAxisOrg;
                var line = new Line({
                    context : {
                        yStart      : yAxisOrg,
                        xEnd        : self.w,
                        yEnd        : yAxisOrg,
                        lineWidth   : self.xOrigin.lineWidth,
                        strokeStyle : self.xOrigin.strokeStyle
                    }
                })
                if(self.xOrigin.enabled)
                    self.sprite.addChild(line)


            }
        };
    
        return Back;
    
    }
)


define(
    "chartx/components/datazoom/index", [
        "canvax/index",
        "canvax/shape/Rect",
        "canvax/shape/Line"
    ],
    function(Canvax, Rect, Line) {

        var dataZoom = function(opt) {
            //0-1
            this.range = {
                start: 0,
                end: 1,
                max : '',
                min : 1
            };
            this.count = 1;
            this.pos = {
                x: 0,
                y: 0
            };
            this.left = {
                eventEnabled : true
            };
            this.right = {
                eventEnabled : true
            };
            this.center = {
                fillStyle : '#ffffff',
                globalAlpha : 0
            };

            this.w = 0;
            this.h = 40;

            this.color = "#008ae6";

            this.bg = {
                enabled : true,
                fillStyle : "",
                strokeStyle: "#e6e6e6",
                lineWidth : 1
            }

            this.underline = {
                enabled : true,
                strokeStyle : this.color,
                lineWidth : 2
            }

            this.dragIng = function(){};
            this.dragEnd = function(){};

            opt && _.deepExtend(this, opt);

            if(!this.range.max)
                this.range.max = this.count;
            if( this.range.end > this.count - 1)
                this.range.end = this.count - 1;
            this.disPart = this._getDisPart();
            this.barAddH = 8;
            this.barH = this.h - this.barAddH;
            this.barY = 6 / 2;
            this.btnW = 8;
            this.btnFillStyle = this.color;
            this._btnLeft = null;
            this._btnRight = null;
            this._underline = null;

            this.init();
        };

        dataZoom.prototype = {
            init: function() {
                var me = this;
                me.sprite = new Canvax.Display.Sprite({
                    id : "dataZoom",
                    context: {
                        x: me.pos.x,
                        y: me.pos.y
                    }
                });
                me.sprite.noSkip=true;
                me.dataZoomBg = new Canvax.Display.Sprite({
                    id : "dataZoomBg"
                });
                me.dataZoomBtns = new Canvax.Display.Sprite({
                    id : "dataZoomBtns"
                });
                me.sprite.addChild( me.dataZoomBg );
                me.sprite.addChild( me.dataZoomBtns );
                me.widget();
                me._setLines()
            },
            widget: function() {
                var me = this;
                if(me.bg.enabled){
                    var bgRect = new Rect({
                        context: {
                            x: 0,
                            y: me.barY,
                            width: me.w,
                            height: me.barH,
                            lineWidth: me.bg.lineWidth,
                            strokeStyle: me.bg.strokeStyle,
                            fillStyle: me.bg.fillStyle
                        }
                    });
                    me.dataZoomBg.addChild(bgRect);
                }

                if(me.underline.enabled){
                    me._underline = me._addLine({
                        xStart : me.range.start / me.count * me.w + me.btnW / 2,
                        yStart : me.barY + me.barH + 2,
                        xEnd   : (me.range.end + 1) / me.count * me.w  - me.btnW / 2,
                        yEnd   : me.barY + me.barH + 2,
                        lineWidth : me.underline.lineWidth,
                        strokeStyle : me.underline.strokeStyle
                    })
                    me.dataZoomBg.addChild(me._underline); 
                }

                me._btnLeft = new Rect({
                    id          : 'btnLeft',
                    dragEnabled : me.left.eventEnabled,
                    context: {
                        x: me.range.start / me.count * me.w,
                        y: me.barY - me.barAddH / 2 + 1,
                        width: me.btnW,
                        height: me.barH + me.barAddH,
                        fillStyle : me.btnFillStyle,
                        cursor: me.left.eventEnabled && "move"
                    }
                });
                me._btnLeft.on("draging" , function(){
                   this.context.y = me.barY - me.barAddH / 2 + 1
                   if(this.context.x < 0){
                       this.context.x = 0;
                   };
                   if(this.context.x > (me._btnRight.context.x - me.btnW - 2)){
                       this.context.x = me._btnRight.context.x - me.btnW - 2
                   };
                   if(me._btnRight.context.x + me.btnW - this.context.x > me.disPart.max){
                       this.context.x = me._btnRight.context.x + me.btnW - me.disPart.max
                   }
                   if(me._btnRight.context.x + me.btnW - this.context.x < me.disPart.min){
                       this.context.x = me._btnRight.context.x + me.btnW - me.disPart.min
                   }
                   me.rangeRect.context.width = me._btnRight.context.x - this.context.x - me.btnW;
                   me.rangeRect.context.x = this.context.x + me.btnW;
                   me._setRange();
                });
                me._btnLeft.on("dragend" , function(){
                   me.dragEnd( me.range );
                });


                me._btnRight = new Rect({
                    id          : 'btnRight',
                    dragEnabled : me.right.eventEnabled,
                    context: {
                        x: (me.range.end + 1) / me.count * me.w - me.btnW,
                        y: me.barY - me.barAddH / 2 + 1,
                        width: me.btnW,
                        height: me.barH + me.barAddH ,
                        fillStyle : me.btnFillStyle,
                        cursor : me.right.eventEnabled && "move"
                    }
                });
                me._btnRight.on("draging" , function(){
                    this.context.y = me.barY - me.barAddH / 2 + 1
                    if( this.context.x > me.w - me.btnW ){
                        this.context.x = me.w - me.btnW;
                    };
                    if( this.context.x + me.btnW - me._btnLeft.context.x > me.disPart.max){
                        this.context.x = me.disPart.max - (me.btnW - me._btnLeft.context.x)
                    }
                    if( this.context.x + me.btnW - me._btnLeft.context.x < me.disPart.min){
                        this.context.x = me.disPart.min - (me.btnW - me._btnLeft.context.x)
                    }
                    me.rangeRect.context.width = this.context.x - me._btnLeft.context.x - me.btnW;
                    me._setRange();
                });
                me._btnRight.on("dragend" , function(){
                    me.dragEnd( me.range );
                });


                //中间矩形拖拽区域
                this.rangeRect = new Rect({
                    id          : 'btnCenter',
                    dragEnabled : true,
                    context : {
                        x : this._btnLeft.context.x + me.btnW,
                        y : this.barY + 1,
                        width : this._btnRight.context.x - this._btnLeft.context.x - me.btnW,
                        height : this.barH - 1,
                        fillStyle : me.center.fillStyle,
                        globalAlpha : me.center.globalAlpha,
                        cursor : "move"
                    }
                });
                this.rangeRect.on("draging" , function(e){
                    this.context.y = me.barY + 1;
                    if( this.context.x < me.btnW ){
                        this.context.x = me.btnW; 
                    };
                    if( this.context.x > me.w - this.context.width - me.btnW ){
                        this.context.x = me.w - this.context.width - me.btnW;
                    };
                    me._btnLeft.context.x  = this.context.x - me.btnW;
                    me._btnRight.context.x = this.context.x + this.context.width;
                    me._setRange();
                });
                this.rangeRect.on("dragend" , function(){
                    me.dragEnd( me.range );
                });

                this.linesLeft = new Canvax.Display.Sprite({ id : "linesLeft" });
                if(this.left.eventEnabled){
                    this._addLines({
                        sprite : this.linesLeft
                    })
                }
                this.linesRight = new Canvax.Display.Sprite({ id : "linesRight" });
                if(this.right.eventEnabled){
                    this._addLines({
                        sprite : this.linesRight
                    })
                }
                this.linesCenter = new Canvax.Display.Sprite({ id : "linesCenter" });
                this._addLines({
                    count  : 6,
                    // dis    : 1,
                    sprite : this.linesCenter,
                    strokeStyle : this.btnFillStyle
                })

                this.dataZoomBtns.addChild( this.rangeRect );
                this.dataZoomBtns.addChild( this.linesCenter );

                this.dataZoomBtns.addChild( this._btnLeft );
                this.dataZoomBtns.addChild( this._btnRight );

                this.dataZoomBtns.addChild( this.linesLeft );
                this.dataZoomBtns.addChild( this.linesRight );
            },

            _getDisPart : function(){
                var me = this
                return {
                    min : me.range.min / me.count * me.w,
                    max : me.range.max / me.count * me.w
                }
            },
            _setRange : function(){
                var me = this
                var start = (me._btnLeft.context.x / me.w) * (me.count - 1) ;
                var end = ( (me._btnRight.context.x + me.btnW) / me.w) * (me.count - 1);
                me.range.start = start;
                me.range.end = end;
                me.dragIng( me.range );
                me._setLines()
            },

            _setLines : function(){
                var me = this
                var linesLeft  = me.dataZoomBtns.getChildById('linesLeft')
                var linesRight = me.dataZoomBtns.getChildById('linesRight')
                var linesCenter = me.dataZoomBtns.getChildById('linesCenter')
                
                var btnLeft    = me.dataZoomBtns.getChildById('btnLeft')
                var btnRight   = me.dataZoomBtns.getChildById('btnRight')
                var btnCenter  = me.dataZoomBtns.getChildById('btnCenter')
                
                linesLeft.context.x = btnLeft.context.x + (btnLeft.context.width - linesLeft.context.width ) / 2
                linesLeft.context.y = btnLeft.context.y + (btnLeft.context.height - linesLeft.context.height ) / 2

                linesRight.context.x = btnRight.context.x + (btnRight.context.width - linesRight.context.width ) / 2
                linesRight.context.y = btnRight.context.y + (btnRight.context.height - linesRight.context.height ) / 2

                linesCenter.context.x = btnCenter.context.x + (btnCenter.context.width - linesCenter.context.width ) / 2
                linesCenter.context.y = btnCenter.context.y + (btnCenter.context.height - linesCenter.context.height ) / 2

                if(me.underline.enabled){
                    me._underline.context.xStart = linesLeft.context.x + me.btnW / 2
                    me._underline.context.xEnd   = linesRight.context.x + me.btnW / 2
                }
            },

            _addLines:function($o){
                var me = this
                var count  = $o.count || 2
                var sprite = $o.sprite
                var dis    = $o.dis || 2
                for(var a = 0, al = count; a < al; a++){
                    sprite.addChild(me._addLine({
                        x : a * dis,
                        strokeStyle : $o.strokeStyle || ''
                    }))
                }
                sprite.context.width = a * dis - 1, sprite.context.height = 6
            },

            _addLine:function($o){
                var o = $o || {}
                var line = new Line({
                    id     : o.id || '',
                    context: {
                        x: o.x || 0,
                        y: o.y || 0,
                        xStart : o.xStart || 0,
                        yStart : o.yStart || 0,
                        xEnd: o.xEnd || 0,
                        yEnd: o.yEnd || 6,
                        lineWidth: o.lineWidth || 1,
                        strokeStyle: o.strokeStyle || '#ffffff'
                    }
                });
                return line
            }
        };
        return dataZoom;
    }
);



/*
 * legendData :
 * [
 *    { field : "uv" , value : 100 , fillStyle : "red" }
 *    ......
 * ]
 *
 **/
define(
    "chartx/components/legend/index" , 
    [
        "canvax/index",
        "canvax/shape/Circle",
        "chartx/components/tips/tip",
    ],
    function(Canvax , Circle , Tips){
        var Legend = function(data , opt){
            this.data = data || [];
            this.width = 0;
            this.height = 0;
            this.tag = {
                height : 20
            };
            this.enabled = false; //1,0 true ,false 

            this.icon = {
                r : 5,
                lineWidth : 1,
                fillStyle : "#999"
            };

            this.tips = {
                enabled : false
            };

            this.onChecked=function(){};
            this.onUnChecked=function(){};

            this._labelColor = "#999";

            //this.label = null; //label格式化函数配置

            this.layoutType = "h"; //横向 horizontal--> h

            this.sprite  = null;

            this.init( opt );
        };
    
        Legend.prototype = {
            init:function( opt ){
                if( opt ){
                    _.deepExtend( this , opt );
                };
                this.sprite = new Canvax.Display.Sprite({
                    id : "LegendSprite"
                });

                this.draw();
            },
            pos : function( pos ){
                pos.x && (this.sprite.context.x = pos.x);
                pos.y && (this.sprite.context.y = pos.y);
            },
            draw:function(opt , _xAxis , _yAxis){
                if( this.enabled ){ 
                    this._widget();
                };
            },
            _showTips : function(e){
                if( this._hideTimer ){
                    clearTimeout( this._hideTimer );
                };
                this._hideTimer = null;

                if( !this._legendTip ){
                    this._legendTip = new Canvax.Display.Sprite({
                        id: 'legend_tip'
                    });
                    var stage = this.sprite.getStage();
                    stage.addChild( this._legendTip );
                    this._tips = new Tips(this.tips, stage.parent.getDomContainer());
                    this._tips._getDefaultContent = function(info) {
                        return info.field;
                    };
                    this._legendTip.addChild( this._tips.sprite );
                };
                this._tips.show(e);
            },
            _hide: function(e){
                var me = this;
                this._hideTimer = setTimeout(function(){
                    me._tips.hide();
                } , 300);
            },
            //label格式化函数配置
            label : function( info ){
                return info.field+"："+info.value;
            },
            setStyle : function( field , style ){
                var me = this;
                _.each( this.data , function( obj , i ){
                    if( obj.field == field ){
                        if( style.fillStyle ){
                            obj.fillStyle = style.fillStyle;
                            var icon = me.sprite.getChildById("lenend_field_"+i).getChildById("lenend_field_icon_"+i);
                            icon.context.fillStyle = style.fillStyle;
                        };
                    };
                } );
            },
            getStyle : function( field ){
                var me = this;
                var data = null;
                _.each( this.data , function( obj , i ){
                    if( obj.field == field ){
                        data = obj;
                    };
                } );
                return data;
            },
            _widget:function(){
                var me = this;
 
                var width = 0,height = 0;
                _.each( this.data , function( obj , i ){

                    //如果外面没有设置过，就默认为激活状态
                    if( obj.activate == undefined || obj.activate ){
                        obj.activate = true;
                    } else {
                        obj.activate = false;
                    };

                    var icon   = new Circle({
                        id : "lenend_field_icon_"+i,
                        context : {
                            x     : 0,
                            y     : me.tag.height/2 ,
                            fillStyle : obj.activate ? "#ccc" : (obj.fillStyle || me._labelColor),
                            r : me.icon.r,
                            cursor: "pointer"
                        }
                    });
                    icon.hover(function( e ){
                        me._showTips( me._getInfoHandler(e,obj) );
                    } , function(e){
                        me._hide(e);
                    });
                    icon.on("mousemove" , function( e ){
                        me._showTips( me._getInfoHandler(e,obj) );
                    });
                    icon.on("click" , function(){});
                    
                    var content= me.label(obj);
                    var txt    = new Canvax.Display.Text( content , {
                        id: "lenend_field_txt_"+i,
                        context : {
                            x : me.icon.r + 3 ,
                            y : me.tag.height / 2,
                            textAlign : "left",
                            textBaseline : "middle",
                            fillStyle : "#333", //obj.fillStyle
                            cursor: "pointer"
                        }
                    } );
                
                    txt.hover(function( e ){
                        me._showTips( me._getInfoHandler(e,obj) );
                    } , function(e){
                        me._hide(e);
                    });
                    txt.on("mousemove" , function( e ){
                        me._showTips( me._getInfoHandler(e,obj) );
                    });
                    txt.on("click" , function(){});

                    var txtW = txt.getTextWidth();
                    var itemW = txtW + me.icon.r*2 + 20;

                    var spItemC = {
                        height : me.tag.height
                    };

                    if( me.layoutType == "v" ){
                        height += me.tag.height;
                        spItemC.y = height;
                        width = Math.max( width , itemW );
                    } else {
                        height = me.tag.height
                        spItemC.x = width ;
                        width += itemW;
                    };
                    var sprite = new Canvax.Display.Sprite({
                        id : "lenend_field_"+i,
                        context : spItemC
                    });
                    sprite.addChild( icon );
                    sprite.addChild( txt );

                    sprite.context.width = itemW;
                    me.sprite.addChild(sprite);

                    sprite.on("click" , function( e ){

                        //只有一个field的时候，不支持取消
                        if( _.filter( me.data , function(obj){return obj.activate} ).length == 1 ){
                            if( obj.activate ){
                                return;
                            }
                        };
                        
                        icon.context.fillStyle = obj.activate ? "#ccc" : (obj.fillStyle || me._labelColor)
                        obj.activate = !obj.activate;
                        if( obj.activate ){
                            me.onChecked( obj.field );
                        } else {
                            me.onUnChecked( obj.field );
                        }
                    });

                } );

                //向后兼容有
                me.width = me.sprite.context.width  = width;
                me.height = me.sprite.context.height = height;
            },
            _getInfoHandler : function(e , data){
                e.eventInfo = {
                    field : data.field,
                    fillStyle : data.fillStyle
                };
                if( data.value ) {
                    e.eventInfo.value = data.value;
                };
                return e;
            }
        };
        return Legend;
    
    } 
)






define(
    "chartx/components/markline/index",
    [
         "canvax/index",
         "canvax/shape/BrokenLine",
         "canvax/display/Sprite",
         "canvax/display/Text"
    ],
    function(Canvax, BrokenLine, Sprite, Text){
        var markLine = function(opt , _yAxis){
            this._yAxis = _yAxis;
            this.w      = 0;
            this.h      = 0
            this.field  = null;
            this.origin = {
                x : 0 , y : 0
            };

            this.target = null; //默认给所有字段都现实一条markline，有设置的话，配置给固定的几个 field 显示markline
            this.value = 0;
            this.line       = {
                y           : 0,
                list        : [],
                strokeStyle : '#999',
                lineWidth   : 1,
                smooth      : false,
                lineType    : 'dashed'
            };

            this.text = {
                enabled  : false,
                content  : '',
                fillStyle: '#999999',
                fontSize : 12,
                format   : null,
                lineType : 'dashed',
                lineWidth: 1,
                strokeStyle : "white"
            };

            this.filter = function( ){
                
            };

            this._doneHandle = null;
            this.done   = function( fn ){
                this._doneHandle = fn;
            };
            this.txt = null;

            this._line = null;
           
            opt && _.deepExtend(this, opt);
            this.init();
        }
        markLine.prototype = {
            init : function(){
                var me = this;

                this.sprite  = new Sprite({ 
                    context : {
                        x : this.origin.x,
                        y : this.origin.y
                    }
                });
                setTimeout( function(){
                    me.widget();
                } , 10 );
            },
            widget : function(){
                var me = this;

                var line = new BrokenLine({               //线条
                    id : "line",
                    context : {
                        y           : me.line.y,
                        pointList   : me.line.list,
                        strokeStyle : me.line.strokeStyle,
                        lineWidth   : me.line.lineWidth,
                        lineType    : me.line.lineType
                    }
                });
                me.sprite.addChild(line);
                me._line = line;


                if(me.text.enabled){
                    var txt = new Text(me.text.content, {           //文字
                        context : me.text
                    })
                    this.txt = txt
                    me.sprite.addChild(txt)

                    if(_.isNumber(me.text.x)){
                        txt.context.x = me.text.x, txt.context.y = me.text.y
                    }else{
                        txt.context.x = this.w - txt.getTextWidth() 
                        txt.context.y = me.line.y - txt.getTextHeight()
                    }
                }

                me._done();
                me.filter( me );
            },
            _done : function(){
                _.isFunction( this._doneHandle ) && this._doneHandle.apply( this , [] );
            },
            reset : function(opt , i){
                opt && _.deepExtend(this, opt);
                if( this.line.y != this._line.context.y ){
                    this._line.animate({
                        y: this.line.y
                    }, {
                        duration: 500,
                        easing: 'Back.Out' //Tween.Easing.Elastic.InOut
                    });
                }
            }
        }
        return markLine
    } 
);


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
            this.hr = 8;
            this.vr = 12;

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
                this.shapeCircle && ( this.shapeCircle.context.visible = true );
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
                       .onComplete(function(){
                           
                       })
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
                require(["canvax/shape/Droplet","canvax/shape/Circle"] , function( Droplet , Circle){
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
                        hoverClone : false,
                        context : ctx
                    });
                    me.sprite.addChild( me.shape );

                    var circleCtx = {
                        y : -me.vr,
                        x : 1,
                        r : Math.max(me.hr-6 , 2) ,
                        fillStyle   : "#fff",//me._fillStyle,
                        //lineWidth   : 0,
                        //strokeStyle : me._strokeStyle,
                        //globalAlpha : me.globalAlpha,
                        visible     : false
                    };
                    me.shapeCircle = new Circle({
                        context : circleCtx
                    });
                    me.sprite.addChild( me.shapeCircle );


                    me._done();
                    
                });
            }
        }
        return markPoint
    } 
);


define(
    "chartx/components/polar/polar",
    [
         "canvax/index",
         "canvax/shape/Path",
         "chartx/utils/tools"
    ],
    function( Canvax , Path, Tools ){
        var Polar = function( opt , data ){
            this.w = opt.w || 0;
            this.h = opt.h || 0;
            this.origin = {
                x: this.w/2,
                y: this.h/2
            };
            this.maxR = null;

            //极坐标的r轴 半径
            this.rAxis = {
                field : null
            };

            //极坐标的t轴，角度
            this.tAxis = {
                field : null
            };

            this.init(opt, data);
        };
        Polar.prototype = {
            init : function(opt , data){
                _.deepExtend(this, opt);
                this._computeMaxR();
            },
            //重新计算maxR
            _computeMaxR : function(){
                //如果外面要求过maxR，
                var origin = this.origin;
                var _maxR;
                if( origin.x != this.w/2 || origin.y != this.h/2 ){
                    var _distances = [ origin.x , this.w-origin.x , origin.y , this.h - origin.y ];
                    _maxR = _.max( _distances );
                } else {
                    _maxR = Math.max( this.w / 2 , this.h / 2 );
                };

                if( this.maxR != null && this.maxR <= _maxR ){
                    return
                } else {
                    this.maxR = _maxR
                };
            },
            //获取极坐标系内任意半径上的弧度集合
            //[ [{point , radian} , {point , radian}] ... ]
            getRadiansAtR: function( r ){
                var me = this;
                var _rs = [];
                if( r > this.maxR ){
                    return [];
                } else {
                    //下面的坐标点都是已经origin为原点的坐标系统里

                    //矩形的4边框线段
                    var origin = this.origin;

                    var x,y;

                    //于上边界的相交点
                    //最多有两个交点
                    var distanceT = origin.y;
                    if( distanceT < r ){
                        x = Math.sqrt( Math.pow(r,2)-Math.pow(distanceT , 2) );
                        _rs = _rs.concat( this._filterPointsInRect([
                            { x : -x ,y : -distanceT},
                            { x : x  ,y : -distanceT}
                        ]) );
                    };

                    //于右边界的相交点
                    //最多有两个交点
                    var distanceR = this.w - origin.x;
                    if( distanceR < r ){
                        y = Math.sqrt( Math.pow(r,2)-Math.pow(distanceR , 2) );
                        _rs = _rs.concat( this._filterPointsInRect([
                            { x : distanceR  ,y : -y},
                            { x : distanceR  ,y : y}
                        ]) );
                    };
                    //于下边界的相交点
                    //最多有两个交点
                    var distanceB = this.h - origin.y;
                    if( distanceB < r ){
                        x = Math.sqrt( Math.pow(r,2)-Math.pow(distanceB , 2) );
                        _rs = _rs.concat( this._filterPointsInRect([
                            { x : x   ,y : distanceB},
                            { x : -x  ,y : distanceB}
                        ]) );
                    };
                    //于左边界的相交点
                    //最多有两个交点
                    var distanceL = origin.x;
                    if( distanceL < r ){
                        y = Math.sqrt( Math.pow(r,2)-Math.pow(distanceL , 2) );
                        _rs = _rs.concat( this._filterPointsInRect([
                            { x : -distanceL  ,y : y},
                            { x : -distanceL  ,y : -y}
                        ]) );
                    };


                    var arcs = [];//[ [{point , radian} , {point , radian}] ... ]
                    //根据相交点的集合，分割弧段
                    if( _rs.length == 0 ){
                        //说明整圆都在画布内
                        //[ [0 , 2*Math.PI] ];
                        arcs.push([
                            {point : {x: r , y: 0} , radian: 0},
                            {point : {x: r , y: 0} , radian: Math.PI*2}
                        ]);
                    } else {
                        //分割多段
                        _.each( _rs , function( point , i ){
                            var nextInd = ( i==(_rs.length-1) ? 0 : i+1 );
                            var nextPoint = _rs.slice( nextInd , nextInd+1 )[0];
                            arcs.push([
                                {point: point , radian: me.getRadianInPoint( point )},
                                {point: nextPoint , radian: me.getRadianInPoint( nextPoint )}
                            ]);
                        } );
                    };

                    //过滤掉不在rect内的弧线段
                    for( var i=0,l=arcs.length ; i<l ; i++ ){
                        if( !this._checkArcInRect( arcs[i] , r ) ){
                            arcs.splice(i , 1);
                            i--,l--;
                        }
                    };
                    return arcs;
                }
            },
            _filterPointsInRect: function( points ){
                for( var i=0,l=points.length; i<l ; i++ ){
                    if( !this._checkPointInRect(points[i]) ){
                        //该点不在root rect范围内，去掉
                        points.splice( i , 1 );
                        i--,l--;
                    }
                };
                return points;
            },
            _checkPointInRect: function(p){
                var origin = this.origin;
                var _tansRoot = { x : p.x + origin.x , y: p.y + origin.y };
                return !( _tansRoot.x < 0 || _tansRoot.x > this.w || _tansRoot.y < 0 || _tansRoot.y > this.h );
            },
            //检查由n个相交点分割出来的圆弧是否在rect内
            _checkArcInRect: function( arc , r){
                var start = arc[0];
                var to = arc[1];
                var differenceR = to.radian - start.radian;
                if( to.radian < start.radian ){
                    differenceR = (Math.PI*2 + to.radian) - start.radian;
                };
                var middleR = (start.radian+differenceR/2)%(Math.PI*2);
                return this._checkPointInRect( this.getPointInRadian( middleR , r ) );
            },
            getRadianInPoint: function( point ){
                var pi2 = Math.PI*2;
                return (Math.atan2(point.y , point.x)+pi2)%pi2;
            },
            getPointInRadian: function(radian , r){
                var pi = Math.PI;
                var x = Math.cos( radian ) * r;
                if( radian == (pi/2) || radian == pi*3/2 ){
                    //90度或者270度的时候
                    x = 0;
                };
                var y = Math.sin( radian ) * r;
                if( radian % pi == 0 ){
                    y = 0;
                };
                return {
                    x : x,
                    y : y
                };
            }
        };
        return Polar;
    } 
);


define(
    "chartx/components/tips/tip",
    [
         "canvax/index",
         "canvax/shape/Rect",
         "chartx/utils/tools"
    ],
    function( Canvax , Rect, Tools ){
        var Tip = function( opt , tipDomContainer ){
            this.enabled = true;
            this.tipDomContainer = tipDomContainer;
            this.cW      = 0;  //容器的width
            this.cH      = 0;  //容器的height
    
            this.dW      = 0;  //html的tips内容width
            this.dH      = 0;  //html的tips内容Height

            this.backR   = "5px";  //背景框的 圆角 
    
            this.sprite  = null;
            this.content = null; //tips的详细内容

            this.fillStyle   = "rgba(255,255,255,0.95)";//"#000000";
            this.text        = {
                fillStyle    : "#999"
            };
            this.strokeStyle = "#ccc";
            
            
            this._tipDom = null;
            //this._back   = null;

            this.offset = 10; //tips内容到鼠标位置的偏移量
        
            //所有调用tip的 event 上面 要附带有符合下面结构的tipsInfo属性
            //会deepExtend到this.indo上面来
            this.tipsInfo    = {
                //nodesInfoList : [],//[{value: , fillStyle : ...} ...]符合iNode的所有Group上面的node的集合
                //iGroup        : 0, //数据组的索引对应二维数据map的x
                //iNode         : 0  //数据点的索引对应二维数据map的y
            };
            this.prefix  = [];
            this.positionInRange = false; //tip的浮层是否限定在画布区域
            this.init(opt);
        }
        Tip.prototype = { 
            init : function(opt){
                _.deepExtend( this , opt );
                this.sprite = new Canvax.Display.Sprite({
                    id : "TipSprite"
                });
                var self = this;
                this.sprite.on("destroy" , function(){
                    self._tipDom = null;
                });
            },
            show : function(e){
                if( !this.enabled ) return;
                this.hide();
                var stage = e.target.getStage();
                this.cW   = stage.context.width;
                this.cH   = stage.context.height;
    
                this._initContent(e);
                
                this.setPosition(e);

                this.sprite.toFront();
            },
            move : function(e){
                if( !this.enabled ) return;
                this._setContent(e);
                this.setPosition(e);
            },
            hide : function(){
                if( !this.enabled ) return;
                this.sprite.removeAllChildren();
                this._removeContent();
            },
            /**
             *@pos {x:0,y:0}
             */
            setPosition : function( e ){
                if(!this._tipDom) return;
                var pos = e.pos || e.target.localToGlobal( e.point );
                var x   = this._checkX( pos.x + this.offset );
                var y   = this._checkY( pos.y + this.offset );
                this._tipDom.style.cssText += ";visibility:visible;left:"+x+"px;top:"+y+"px;-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
            },
            /**
             *content相关-------------------------
             */
            _initContent : function(e){
                this._tipDom = document.createElement("div");
                this._tipDom.className = "chart-tips";
                this._tipDom.style.cssText += "；-moz-border-radius:"+this.backR+"; -webkit-border-radius:"+this.backR+"; border-radius:"+this.backR+";background:"+this.fillStyle+";border:1px solid "+this.strokeStyle+";visibility:hidden;position:absolute;display:inline-block;*display:inline;*zoom:1;padding:6px;color:"+this.text.fillStyle+";line-height:1.5"
                this._tipDom.style.cssText += "; -moz-box-shadow:1px 1px 3px "+this.strokeStyle+"; -webkit-box-shadow:1px 1px 3px "+this.strokeStyle+"; box-shadow:1px 1px 3px "+this.strokeStyle+";"
                this.tipDomContainer.appendChild( this._tipDom );
                this._setContent(e);
            },
            _removeContent : function(){
                if(!this._tipDom){
                    return;
                };
                this.tipDomContainer.removeChild( this._tipDom );
                this._tipDom = null;
            },
            _setContent : function(e){
                if (!this._tipDom){
                    return;
                };
                var tipxContent = this._getContent(e);
                if( tipxContent === "_hide_" || tipxContent === "" ){
                    this.hide();
                    return;
                };
                this._tipDom.innerHTML = tipxContent;
                this.dW = this._tipDom.offsetWidth;
                this.dH = this._tipDom.offsetHeight;
            },
            _getContent : function(e){
                _.extend( this.tipsInfo , (e.tipsInfo || e.eventInfo || {}) );
                var tipsContent = _.isFunction(this.content) ? this.content( this.tipsInfo ) : this.content ;
                //只有undefined false null才会继续走默认配置， "" 0 都会认为是用户的意思
                if( !tipsContent && tipsContent != 0 ){
                    tipsContent = this._getDefaultContent( this.tipsInfo );
                }
                return tipsContent;
            },
            _getDefaultContent : function( info ){
                var str  = "<table style='border:none'>";
                var self = this;
                _.each( info.nodesInfoList , function( node , i ){

                    str+= "<tr style='color:"+ (node.color || node.fillStyle || node.strokeStyle) +"'>";
                    var tsStyle="style='border:none;white-space:nowrap;word-wrap:normal;'";
                    var prefixName = self.prefix[i];
                    if( prefixName ) {
                        str+="<td "+tsStyle+">"+ prefixName +"：</td>";
                    } else {
                        if( node.field ){
                            str+="<td "+tsStyle+">"+ node.field +"：</td>";
                        }
                    };
                    str += "<td "+tsStyle+">"+ Tools.numAddSymbol(node.value) +"</td></tr>";
                });
                str+="</table>";
                return str;
            },    
            /**
             *获取back要显示的x
             *并且校验是否超出了界限
             */
            _checkX : function( x ){
                if( this.positionInRange ){
                    var w = this.dW + 2; //后面的2 是 两边的 linewidth
                    if( x < 0 ){
                        x = 0;
                    }
                    if( x + w > this.cW ){
                        x = this.cW - w;
                    }
                }
                return x
            },
    
            /**
             *获取back要显示的x
             *并且校验是否超出了界限
             */
            _checkY : function( y ){
                if(this.positionInRange){
                    var h = this.dH + 2; //后面的2 是 两边的 linewidth
                    if( y < 0 ){
                        y = 0;
                    }
                    if( y + h > this.cH ){
                        y = this.cH - h;
                    }
                }
                return y
            }
        }
        return Tip
    } 
);


define(
    "chartx/components/xaxis/xAxis", [
        "canvax/index",
        "canvax/core/Base",
        "canvax/shape/Line",
        "chartx/utils/tools"
    ],
    function(Canvax, CanvaxBase, Line, Tools) {
        var xAxis = function(opt, data) {
            this.graphw = 0;
            this.graphh = 0;
            this.yAxisW = 0;
            this.width = 0;
            this.height = 0;

            this.disY = 1;
            this.dis = 6; //线到文本的距离

            this.label = "";
            this._label = null; //this.label对应的文本对象

            this.line = {
                enabled: 1, //是否有line
                width: 1,
                height: 4,
                strokeStyle: '#cccccc'
            };

            this.text = {
                fillStyle: '#999',
                fontSize: 12,
                rotation: 0,
                format: null,
                textAlign: null
            };
            this.maxTxtH = 0;

            this.pos = {
                x: null,
                y: null
            };

            //this.display = "block";
            this.enabled = 1; //1,0 true ,false 

            this.disXAxisLine = 6; //x轴两端预留的最小值
            this.disOriginX = 0; //背景中原点开始的x轴线与x轴的第一条竖线的偏移量
            this.xGraphsWidth = 0; //x轴宽(去掉两端)

            this.dataOrg = []; //源数据
            this.dataSection = []; //默认就等于源数据
            this._layoutDataSection = []; //dataSection的format后的数据
            this.data = []; //{x:100, content:'1000'}
            this.layoutData = []; //this.data(可能数据过多),重新编排过滤后的数据集合, 并根据此数组展现文字和线条
            this.sprite = null;

            this._textMaxWidth = 0;
            this.leftDisX = 0; //x轴最左边需要的间距。默认等于第一个x value字符串长度的一半

            //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
            //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
            this.filter = null; //function(params){}; 

            this.isH = false; //是否为横向转向的x轴

            this.animation = true;
            this.resize = false;
    
            this.maxVal = null; 
            this.minVal = null; 

            this.xDis = 0; //x方向一维均分长度,layoutType==peak的时候要用到

            this.layoutType = "step"; //step , rule , peak, proportion

            this.autoTrimLayout = true;

            this.init(opt, data);
        };

        xAxis.prototype = {
            init: function(opt, data) {
                this.sprite = new Canvax.Display.Sprite({
                    id: "xAxisSprite"
                });
                this.rulesSprite = new Canvax.Display.Sprite({
                    id: "rulesSprite"
                });
                this.sprite.addChild( this.rulesSprite );
                this._initHandle(opt, data);
            },
            _initHandle: function(opt, data) {

                if(data && data.org){
                    this.dataOrg = data.org;
                };

                if (opt) {
                    _.deepExtend(this, opt);
                    if( !opt.dataSection && this.dataOrg ){
                        //如果没有传入指定的dataSection，才需要计算dataSection
                        this.dataSection = this._initDataSection(this.dataOrg);
                    }
                };

                if (this.text.rotation != 0 && this.text.rotation % 90 == 0) {
                    this.isH = true;
                };

                if (!this.line.enabled) {
                    this.line.height = 1
                };

                //先计算出来显示文本
                this._layoutDataSection = this._formatDataSectionText(this.dataSection);

                //然后计算好最大的width 和 最大的height，外部组件需要用
                this._setTextMaxWidth();
                this._setXAxisHeight();

                //取第一个数据来判断xaxis的刻度值类型是否为 number
                this.minVal == null && (this.minVal = _.min( this.dataSection ));
                this.maxVal == null && (this.maxVal = _.max( this.dataSection ));

            },
            /**
             *return dataSection 默认为xAxis.dataOrg的的faltten
             *即 [ [1,2,3,4] ] -- > [1,2,3,4]
             */
            _initDataSection: function(data) {
                return _.flatten(data);
            },
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            //配置和数据变化
            reset: function(opt, data) {
                //先在field里面删除一个字段，然后重新计算
                _.deepExtend(this, opt);

                this._initHandle(opt, data);

                this.draw();

            },
            //数据变化，配置没变的情况
            resetData: function(data) {
                this.sprite.removeAllChildren();
                this.dataSection = [];

                this._initHandle(null, data);

                this.draw();
            },
            getIndexOfVal : function(xvalue){
                var i;
                for( var ii=0,il=this.data.length ; ii<il ; ii++ ){
                    var obj = this.data[ii];
                    if(obj.content == xvalue){
                        i = ii;
                        break;
                    }
                };

                return i;
            },
            
            draw: function(opt) {
                // this.data = [{x:0,content:'0000'},{x:100,content:'10000'},{x:200,content:'20000'},{x:300,content:'30000'},{x:400,content:'0000'},{x:500,content:'10000'},{x:600,content:'20000'}]
                if( this.data.length == 0 ){

                };
                this._getLabel();
                this._initConfig(opt);
                this.data = this._trimXAxis(this.dataSection, this.xGraphsWidth);
                var me = this;
                _.each(this.data, function(obj, i) {
                    obj.layoutText = me._layoutDataSection[i];
                });

                this._trimLayoutData();

                this.setX(this.pos.x);
                this.setY(this.pos.y);

                if (this.enabled) { //this.display != "none"
                    this._widget();

                    if (!this.text.rotation) {
                        this._layout();
                    }
                };

                this.resize = false;
                // this.data = this.layoutData
            },
            _getLabel: function() {
                if (this.label && this.label != "") {

                    this._label = new Canvax.Display.Text(this.label, {
                        context: {
                            fontSize: this.text.fontSize,
                            textAlign: this.isH ? "center" : "left",
                            textBaseline: this.isH ? "top" : "middle",
                            fillStyle: this.text.fillStyle,
                            rotation: this.isH ? -90 : 0
                        }
                    });
                }
            },
            //初始化配置
            _initConfig: function(opt) {
                if (opt) {
                    _.deepExtend(this, opt);
                };

                this.yAxisW = Math.max(this.yAxisW, this.leftDisX);
                this.width = this.graphw - this.yAxisW;
                if (this.pos.x == null) {
                    this.pos.x = this.yAxisW + this.disOriginX;
                };
                if (this.pos.y == null) {
                    this.pos.y = this.graphh - this.height;
                };
                this.xGraphsWidth = parseInt(this.width - this._getXAxisDisLine());

                if (this._label) {
                    if (this.isH) {
                        this.xGraphsWidth -= this._label.getTextHeight() + 5
                    } else {
                        this.xGraphsWidth -= this._label.getTextWidth() + 5
                    }
                };
                this.disOriginX = parseInt((this.width - this.xGraphsWidth) / 2);
            },
            //获取x对应的位置
            //val ind 至少要有一个
            getPosX: function( opt ){
                var x = 0;
                var val = opt.val; 
                var ind = "ind" in opt ? opt.ind : _.indexOf( this.dataSection , val );//如果没有ind 那么一定要有val
                var dataLen = "dataLen" in opt ? opt.dataLen : this.dataSection.length;
                var xGraphsWidth = "xGraphsWidth" in opt ? opt.xGraphsWidth : this.xGraphsWidth;
                var layoutType = "layoutType" in opt ? opt.layoutType : this.layoutType;

                if( dataLen == 1 ){
                    x =  xGraphsWidth / 2;
                } else {
                    if( layoutType == "rule" ){
                        x = ind / (dataLen - 1) * xGraphsWidth;
                    };
                    if( layoutType == "proportion" ){
                        //按照数据真实的值在minVal - maxVal区间中的比例值
                        if( val == undefined ){
                            val = (ind * (this.maxVal - this.minVal)/(dataLen-1)) + this.minVal;
                        };
                        x = xGraphsWidth * ( (val - this.minVal) / (this.maxVal - this.minVal) );
                    };
                    if( layoutType == "peak" ){
                        x = this.xDis * (ind+1) - this.xDis/2;
                    };
                    if( layoutType == "step" ){
                        x = (xGraphsWidth / (dataLen + 1)) * (ind + 1);
                    };
                };
                return parseInt( x , 10 );
            },
            _trimXAxis: function($data, $xGraphsWidth) {
                var tmpData = [];
                var data = $data || this.dataSection;
                var xGraphsWidth = xGraphsWidth || this.xGraphsWidth;

                this.xDis = parseInt(xGraphsWidth / data.length);//这个属性目前主要是柱状图有分组柱状图的场景在用

                for (var a = 0, al  = data.length; a < al; a++ ) {
                    var txt = new Canvax.Display.Text( data[a] , {
                        context: {
                            fontSize: this.text.fontSize
                        }
                    });
                    var o = {
                        'content':data[a], 
                        'x': this.getPosX({
                            val : data[a],
                            ind : a,
                            dataLen: al,
                            xGraphsWidth : xGraphsWidth
                        }),
                        'textWidth': txt.getTextWidth()
                    };
                    tmpData.push( o );
                };
                return tmpData;
            },
            _formatDataSectionText: function(arr) {
                if (!arr) {
                    arr = this.dataSection;
                };
                var me = this;
                var currArr = [];
                _.each(arr, function(val) {
                    currArr.push(me._getFormatText(val));
                });
                return currArr;
            },
            _getXAxisDisLine: function() { //获取x轴两端预留的距离
                var disMin = this.disXAxisLine
                var disMax = 2 * disMin
                var dis = disMin
                dis = disMin + this.width % _.flatten(this.dataOrg).length
                dis = dis > disMax ? disMax : dis
                dis = isNaN(dis) ? 0 : dis
                return dis
            },
            _setXAxisHeight: function() { //检测下文字的高等
                if (!this.enabled) { //this.display == "none"
                    this.dis = 0;
                    this.height = 3; //this.dis;//this.max.txtH;
                } else {
                    var txt = new Canvax.Display.Text(this._layoutDataSection[0] || "test", {
                        context: {
                            fontSize: this.text.fontSize
                        }
                    });

                    this.maxTxtH = txt.getTextHeight();

                    if (!!this.text.rotation) {
                        if (this.text.rotation % 90 == 0) {
                            this.height = this._textMaxWidth + this.line.height + this.disY + this.dis + 3;
                        } else {
                            var sinR = Math.sin(Math.abs(this.text.rotation) * Math.PI / 180);
                            var cosR = Math.cos(Math.abs(this.text.rotation) * Math.PI / 180);
                            this.height = sinR * this._textMaxWidth + txt.getTextHeight() + 5;
                            this.leftDisX = cosR * txt.getTextWidth() + 8;
                        }
                    } else {
                        this.height = this.disY + this.line.height + this.dis + this.maxTxtH;
                        this.leftDisX = txt.getTextWidth() / 2;
                    }
                }
            },
            _getFormatText: function(text) {
                var res;
                if (_.isFunction(this.text.format)) {
                    res = this.text.format(text);
                } else {
                    res = text
                }
                if (_.isArray(res)) {
                    res = Tools.numAddSymbol(res);
                }
                if (!res) {
                    res = text;
                };
                return res;
            },
            _widget: function() {
                var arr = this.layoutData

                if (this._label) {
                    this._label.context.x = this.xGraphsWidth + 5;
                    this.sprite.addChild(this._label);
                };

                var delay = Math.min(1000 / arr.length, 25);

                for (var a = 0, al = arr.length; a < al; a++) {
                    xNodeId = "xNode" + a;

                    var xNode = this.rulesSprite.getChildById(xNodeId) 
                    if( !xNode ){
                        xNode = new Canvax.Display.Sprite({
                            id: xNodeId
                        });
                        this.rulesSprite.addChild(xNode);
                    }

                    xNode.context.visible = arr[a].visible;

                    var o = arr[a]
                    var x = o.x,
                        y = this.disY + this.line.height + this.dis;

                    //文字
                    var textContext = {
                        x: x,
                        y: y + 20,
                        fillStyle: this.text.fillStyle,
                        fontSize: this.text.fontSize,
                        rotation: -Math.abs(this.text.rotation),
                        textAlign: this.text.textAlign || (!!this.text.rotation ? "right" : "center"),
                        textBaseline: !!this.text.rotation ? "middle" : "top",
                        globalAlpha: 0
                    };

                    if( xNode._txt ){
                        //_.extend( xNode._txt.context , textContext );
                        //debugger
                        xNode._txt.resetText( o.layoutText+"" );
                        if( this.animation ){
                            xNode._txt.animate( {
                                x : textContext.x
                            } , {
                                duration : 300
                            });
                        } else {
                            xNode._txt.context.x = textContext.x
                        }

                    } else {

                        xNode._txt = new Canvax.Display.Text(o.layoutText, {
                            id: "xAxis_txt_" + CanvaxBase.getUID(),
                            context: textContext
                        });
                        xNode.addChild( xNode._txt );

                        //新建的 txt的 动画方式
                        if (this.animation && !this.resize) {
                            xNode._txt.animate({
                                globalAlpha: 1,
                                y: xNode._txt.context.y - 20
                            }, {
                                duration: 500,
                                easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                                delay: a * delay,
                                id: xNode._txt.id
                            });
                        } else {
                            xNode._txt.context.y = xNode._txt.context.y - 20;
                            xNode._txt.context.globalAlpha = 1;
                        };
                    };
                    if (!!this.text.rotation && this.text.rotation != 90) {
                        xNode._txt.context.x += 5;
                        xNode._txt.context.y += 3;
                    };

                    if (this.line.enabled) {
                        var lineContext = {
                            x: x,
                            y: this.disY,
                            xEnd: 0,
                            yEnd: this.line.height + this.disY,
                            lineWidth: this.line.width,
                            strokeStyle: this.line.strokeStyle
                        };
                        if( xNode._line ){
                            //_.extend( xNode._txt.context , textContext );
                            if( this.animation ){
                                xNode._line.animate({
                                    x : lineContext.x
                                } , {
                                    duration : 300
                                })
                            } else {
                                xNode._line.context.x = lineContext.x;
                            };
                        } else {
                            xNode._line = new Line({
                                context: lineContext
                            });
                            xNode.addChild(xNode._line);
                        }
                    };

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(this.filter) && this.filter({
                        layoutData: arr,
                        index: a,
                        txt: xNode._txt,
                        line: xNode._line || null
                    });
                    
                };

                //把sprite.children中多余的给remove掉
                if( this.rulesSprite.children.length > arr.length ){
                    for( var al = arr.length,pl = this.rulesSprite.children.length;al<pl;al++  ){
                        this.rulesSprite.getChildAt( al ).remove();
                        al--,pl--;
                    };
                };

            },
            /*校验最后一个文本是否超出了界限。然后决定是否矫正*/
            _layout: function() {

                if (this.data.length == 0 || this.rulesSprite.getNumChildren() <=1 ){
                    return;
                };

                var popText = this.rulesSprite.getChildAt(this.rulesSprite.getNumChildren() - 1).getChildAt(0);
                if (popText) {
                    var pc = popText.context;
                    if (pc.textAlign == "center" &&
                        pc.x + popText.context.width / 2 > this.width) {
                        pc.x = this.width - popText.context.width / 2
                    };
                    if (pc.textAlign == "left" &&
                        pc.x + popText.context.width > this.width) {
                        pc.x = this.width - popText.context.width
                    };
                    if (this.rulesSprite.getNumChildren() > 2) {
                        //倒数第二个text
                        var popPreText = this.rulesSprite.getChildAt(this.rulesSprite.getNumChildren() - 2).getChildAt(0);
                        var ppc = popPreText.context;
                        //如果最后一个文本 和 倒数第二个 重叠了，就 隐藏掉
                        if (ppc.visible && pc.x < ppc.x + ppc.width) {
                            pc.visible = false;
                        }
                    }
                }
            },
            _setTextMaxWidth: function() {
                var arr = this._layoutDataSection;
                var maxLenText = arr[0];

                for (var a = 0, l = arr.length; a < l; a++) {
                    if (arr[a].length > maxLenText.length) {
                        maxLenText = arr[a];
                    }
                };

                var txt = new Canvax.Display.Text(maxLenText || "test", {
                    context: {
                        fillStyle: this.text.fillStyle,
                        fontSize: this.text.fontSize
                    }
                });

                this._textMaxWidth = txt.getTextWidth();
                this._textMaxHeight = txt.getTextHeight();

                return this._textMaxWidth;
            },
            _trimLayoutData: function() {

                var arr = this.data;

                var ind = 0;
                var l = arr.length;

                while( ind < l ){
                    var curr = arr[ind];
                    curr.visible = true;
                    if( arr[ind+1] ){
                        for( var ii=ind ; ii<l; ii++ ){
                            var next = arr[ii+1];
                            if( next.x >= curr.x+curr.textWidth ){
                                ind = ii+1;
                                break;
                            } else {
                                next.visible = false;
                            }
                        }
                    } else {
                        break;
                    }
                }

                this.layoutData = this.data;

            }
        };
        return xAxis;
    }
)


define(
    "chartx/components/yaxis/yAxis", [
        "canvax/index",
        "canvax/core/Base",
        "canvax/shape/Line",
        "chartx/utils/tools",
        "chartx/utils/datasection"
    ],
    function(Canvax, CanvaxBase, Line, Tools, DataSection) {
        var yAxis = function(opt, data ) {

            this.width = null;
            this.enabled = 1; //true false 1,0都可以
            this.dis = 6; //线到文本的距离
            this.maxW = 0; //最大文本的width
            this.field = []; //这个 轴 上面的 field

            this.label = "";
            this._label = null; // label 的text对象

            this.line = {
                enabled: 1, //是否有line
                width: 4,
                lineWidth: 1,
                strokeStyle: '#cccccc'
            };

            this.text = {
                fillStyle: '#999',
                fontSize: 12,
                format: null,
                rotation: 0
            };
            this.pos = {
                x: 0,
                y: 0
            };
            this.place = "left"; //yAxis轴默认是再左边，但是再双轴的情况下，可能会right
            this.biaxial = false; //是否是双轴中的一份
            this.layoutData = []; //dataSection 对应的layout数据{y:-100, content:'1000'}
            this.dataSection = []; //从原数据 dataOrg 中 结果 datasection 重新计算后的数据

            //默认的 dataSectionGroup = [ dataSection ], dataSection 其实就是 dataSectionGroup 去重后的一维版本
            this.dataSectionGroup = []; 

            //如果middleweight有设置的话 dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]
            this.middleweight = null; 

            this.dataOrg = []; //源数据

            this.sprite = null;
            //this.x           = 0;
            //this.y           = 0;
            this.disYAxisTopLine = 6; //y轴顶端预留的最小值
            this.yMaxHeight = 0; //y轴最大高
            this.yGraphsHeight = 0; //y轴第一条线到原点的高

            this.baseNumber = null;
            this.basePoint = null; //value为baseNumber的point {x,y}

            this.maxNumber = null;
            this.minNumber = null;

            //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
            //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
            this.filter = null; //function(params){}; 

            this.isH = false; //是否横向

            this.animation = true;
            this.resize = false;

            this.sort = null; //"asc" //排序，默认从小到大, desc为从大到小，之所以不设置默认值为asc，是要用null来判断用户是否进行了配置

            this.init(opt, data );
        };

        yAxis.prototype = {
            init: function(opt, data ) {
                _.deepExtend(this, opt);

                if (this.text.rotation != 0 && this.text.rotation % 90 == 0) {
                    this.isH = true;
                };

                this._initData(data);
                this.sprite = new Canvax.Display.Sprite({
                    id: "yAxisSprite"
                });
                this.rulesSprite = new Canvax.Display.Sprite({
                    id: "yRulesSprite"
                });
                this.sprite.addChild( this.rulesSprite );
            },
            setX: function($n) {
                this.sprite.context.x = $n + (this.place == "left" ? Math.max(this.maxW , (this.width - this.pos.x - this.dis - this.line.width) ) : 0);
                this.pos.x = $n;
            },
            setY: function($n) {
                this.sprite.context.y = $n;
                this.pos.y = $n;
            },
            setAllStyle: function(sty) {
                _.each(this.rulesSprite.children, function(s) {
                    _.each(s.children, function(cel) {
                        if (cel.type == "text") {
                            cel.context.fillStyle = sty;
                        } else if (cel.type == "line") {
                            cel.context.strokeStyle = sty;
                        }
                    });
                });
            },
            //配置和数据变化
            reset: function(opt, data) {
                //先在field里面删除一个字段，然后重新计算
                this.dataSection = [];
                this.dataSectionGroup = [];

                if (opt) {
                    _.deepExtend(this, opt);
                };

                this._initData(data);
                this._trimYAxis();
                this._widget();
            },
            _getLabel: function() {

                var _label = "";
                if(_.isArray(this.label)){
                    _label = this.label[ this.place == "left" ? 0 : 1 ];
                } else {
                    _label = this.label;
                };
                
                if (_label && _label != "") {
                    this._label = new Canvax.Display.Text(_label, {
                        context: {
                            fontSize: this.text.fontSize,
                            textAlign: this.place,//"left",
                            textBaseline: this.isH ? "top" : "bottom",
                            fillStyle: this.text.fillStyle,
                            rotation: this.isH ? -90 : 0
                        }
                    });
                }
            },
            draw: function(opt) {
                opt && _.deepExtend(this, opt);
                this._getLabel();
                this.yGraphsHeight = this.yMaxHeight - this._getYAxisDisLine();

                if (this._label) {
                    if (this.isH) {
                        this.yGraphsHeight -= this._label.getTextWidth();
                    } else {
                        this.yGraphsHeight -= this._label.getTextHeight();
                    }
                    this._label.context.y = -this.yGraphsHeight - 5;
                };
                
                this._trimYAxis();
                this._widget();

                this.setX(this.pos.x);
                this.setY(this.pos.y);

                this.resize = false;
            },
            //更具y轴的值来输出对应的在y轴上面的位置
            getYposFromVal : function( val ){
                var y = 0;
                var dsgLen = this.dataSectionGroup.length;
                var yGroupHeight = this.yGraphsHeight / dsgLen ;

                for( var i=0,l=dsgLen ; i<l ; i++ ){
                    var ds = this.dataSectionGroup[i];
                    var min = _.min(ds);
                    var max = _.max(ds);
                    var bottom = ds[0];
                    var top = ds.slice(-1)[0];
                    if( 
                        (val > min && val <= max) || 
                        ( this._getSortType() == "desc" && val >= min && val < max )
                    ){
                        var y = -((val - bottom) / (top - bottom) * yGroupHeight + i*yGroupHeight) ;
                        break;
                    }
                };
                y = isNaN(y) ? 0 : parseInt(y);
                return y;
                
                /*
                var max = this.dataSection[this.dataSection.length - 1];
                var y = -(val - this._bottomNumber) / (max - this._bottomNumber) * this.yGraphsHeight;
                y = isNaN(y) ? 0 : parseInt(y);
                return y;
                */
            },
            getValFromYpos: function( y ){
                var start = this.layoutData[0];
                var end   = this.layoutData.slice(-1)[0];
                var val = (end.content-start.content) * ((y-start.y)/(end.y-start.y)) + start.content;
                return val;
            },
            _trimYAxis: function() {

                var max = this.dataSection[this.dataSection.length - 1];
                var tmpData = [];
                for (var a = 0, al = this.dataSection.length; a < al; a++) {
                    tmpData[a] = {
                        content: this.dataSection[a],
                        y: this.getYposFromVal( this.dataSection[a] )
                    };
                };
                this.layoutData = tmpData;
                //设置basePoint
                var basePy = -(this.baseNumber - this._bottomNumber) / (max - this._bottomNumber) * this.yGraphsHeight;
                basePy = isNaN(basePy) ? 0 : parseInt(basePy);
                this.basePoint = {
                    content: this.baseNumber,
                    y: basePy
                };
            },
            _getYAxisDisLine: function() { //获取y轴顶高到第一条线之间的距离         
                var disMin = this.disYAxisTopLine
                var disMax = 2 * disMin
                var dis = disMin
                dis = disMin + this.yMaxHeight % this.dataSection.length;
                dis = dis > disMax ? disMax : dis
                return dis
            }, 
            _setDataSection: function(data) {

                var arr = [];
                var d = (data.org || data.data || data);
                if (!this.biaxial) {
                    arr = _.flatten( d ); //_.flatten( data.org );
                } else {
                    if (this.place == "left") {
                        arr = _.flatten(d[0]);
                        this.field = _.flatten([this.field[0]]);
                    } else {
                        arr = _.flatten(d[1]);
                        this.field = _.flatten([this.field[1]]);
                    }
                };
                for( var i = 0, il=arr.length; i<il ; i++ ){
                    arr[i] =  arr[i] || 0;
                };

                return arr;
            },
            _initData: function(data) {

                //先要矫正子啊field确保一定是个array
                if( !_.isArray(this.field) ){
                    this.field = [this.field];
                };

                var arr = this._setDataSection(data);
                if( arr.length == 1 ){
                    arr.push( arr[0]*2 );
                }
                this.dataOrg = (data.org || data.data); //这里必须是data.org
                if (this.dataSection.length == 0) {
                    this.dataSection = DataSection.section(arr, 3);
                };

                //如果还是0
                if (this.dataSection.length == 0) {
                    this.dataSection = [0]
                };   
                this.dataSectionGroup = [ _.clone(this.dataSection) ];

                this._sort();
                this._setBottomAndBaseNumber();

                this._middleweight(); //如果有middleweight配置，需要根据配置来重新矫正下datasection
            },
            _sort: function(){
                if (this.sort) {
                    var sort = this._getSortType();
                    if (sort == "desc") {
                        this.dataSection.reverse();

                        //dataSectionGroup 从里到外全部都要做一次 reverse， 这样就可以对应上 dataSection.reverse()
                        _.each( this.dataSectionGroup , function( dsg , i ){
                            dsg.reverse();
                        } );
                        this.dataSectionGroup.reverse();
                        //dataSectionGroup reverse end
                    };
                };
            },
            _getSortType: function(){
                var _sort;
                if( _.isString(this.sort) ){
                    _sort = this.sort;
                }
                if( _.isArray(this.sort) ){
                    _sort = this.sort[ this.place == "left" ? 0 : 1 ];
                }
                if( !_sort ){
                    _sort = "asc";
                }
                return _sort;
            },
            _setBottomAndBaseNumber : function(){
                this._bottomNumber = this.dataSection[0];
                if (this.baseNumber == null) {
                    var min = _.min( this.dataSection );
                    this.baseNumber = min > 0 ? min : 0;
                }
            },
            _middleweight : function(){
                if( this.middleweight ){
                    //支持多个量级的设置
                    //量级的设置只支持非sort的柱状图场景，否则这里修改过的datasection会和 _initData 中sort过的逻辑有冲突
                    if( !_.isArray( this.middleweight ) ){
                        this.middleweight = [ this.middleweight ];
                    };

                    //拿到dataSection中的min和max后，用middleweight数据重新设置一遍dataSection
                    var dMin = _.min( this.dataSection );
                    var dMax = _.max( this.dataSection );
                    var newDS = [ dMin ];
                    var newDSG = [];

                    for( var i=0,l=this.middleweight.length ; i<l ; i++ ){
                        var preMiddleweight = dMin;
                        if( i > 0 ){
                            preMiddleweight = this.middleweight[ i-1 ];
                        };
                        var middleVal = preMiddleweight + parseInt( (this.middleweight[i] - preMiddleweight) / 2 );

                        newDS.push( middleVal );
                        newDS.push( this.middleweight[i] );

                        newDSG.push([
                            preMiddleweight,
                            middleVal,
                            this.middleweight[i]
                        ]);
                    };
                    var lastMW = parseInt( this.middleweight.slice(-1)[0] );
                    newDS.push( lastMW + parseInt( (dMax - lastMW) / 2 ) );
                    newDS.push( dMax );

                    newDSG.push([
                        lastMW,
                        lastMW + parseInt( (dMax - lastMW) / 2 ),
                        dMax
                    ]);

                    //好了。 到这里用简单的规则重新拼接好了新的 dataSection
                    this.dataSection = newDS;
                    this.dataSectionGroup = newDSG;

                    //因为重新设置过了 dataSection 所以要重新排序和设置bottom and base 值
                    this._sort();
                    this._setBottomAndBaseNumber();
                };                
            },
            resetWidth: function(width) {
                var self = this;
                self.width = width;
                if (self.line.enabled) {
                    self.sprite.context.x = width - self.dis - self.line.width;
                } else {
                    self.sprite.context.x = width - self.dis;
                }
            },
            _widget: function() {
                var self = this;
                if (!self.enabled) {
                    self.width = 0;
                    return;
                }
                var arr = this.layoutData;
                self.maxW = 0;
                self._label && self.sprite.addChild(self._label);
                for (var a = 0, al = arr.length; a < al; a++) {
                    var o = arr[a];
                    var x = 0,
                        y = o.y;
                    var content = o.content
                    if (_.isFunction(self.text.format)) {
                        content = self.text.format(content, self);
                    };
                    if( content === undefined || content === null ){
                        content = Tools.numAddSymbol( o.content );
                    };  

                
                    var textAlign = (self.place == "left" ? "right" : "left");
                    //为横向图表把y轴反转后的 逻辑
                    if (self.text.rotation == 90 || self.text.rotation == -90) {
                        textAlign = "center";
                        if (a == arr.length - 1) {
                            textAlign = "right";
                        }
                    };
                    var posy = y + (a == 0 ? -3 : 0) + (a == arr.length - 1 ? 3 : 0);
                    //为横向图表把y轴反转后的 逻辑
                    if (self.text.rotation == 90 || self.text.rotation == -90) {
                        if (a == arr.length - 1) {
                            posy = y - 2;
                        }
                        if (a == 0) {
                            posy = y;
                        }
                    };

                    var yNode = this.rulesSprite.getChildAt(a);

                    if( yNode ){
                        if(yNode._txt){
                            if( yNode._txt.context.y != posy ){
                                yNode._txt.animate({
                                    y: posy
                                }, {
                                    duration: 500,
                                    delay: a*80,
                                    id: yNode._txt.id
                                });
                            };
                            yNode._txt.resetText( content );
                        };

                        yNode._line && yNode._line.animate({
                            y: y
                        }, {
                            duration: 500,
                            delay: a*80,
                            id: yNode._line.id
                        });
                    } else {
                        yNode = new Canvax.Display.Sprite({
                            id: "yNode" + a
                        });

                        //文字
                        var txt = new Canvax.Display.Text(content, {
                            id: "yAxis_txt_" + CanvaxBase.getUID(),
                            context: {
                                x: x + (self.place == "left" ? -5 : 5),
                                y: posy + 20,
                                fillStyle: self._getProp(self.text.fillStyle),
                                fontSize: self.text.fontSize,
                                rotation: -Math.abs(this.text.rotation),
                                textAlign: textAlign,
                                textBaseline: "middle",
                                globalAlpha: 0
                            }
                        });
                        yNode.addChild(txt);
                        yNode._txt = txt;

                        self.maxW = Math.max(self.maxW, txt.getTextWidth());
                        if (self.text.rotation == 90 || self.text.rotation == -90) {
                            self.maxW = Math.max(self.maxW, txt.getTextHeight());
                        };


                        if (self.line.enabled) {
                            //线条
                            var line = new Line({
                                context: {
                                    x: 0 + (self.place == "left" ? +1 : -1) * self.dis - 2,
                                    y: y,
                                    xEnd: self.line.width,
                                    yEnd: 0,
                                    lineWidth: self.line.lineWidth,
                                    strokeStyle: self._getProp(self.line.strokeStyle)
                                }
                            });
                            yNode.addChild(line);
                            yNode._line = line;
                        };
                        //这里可以由用户来自定义过滤 来 决定 该node的样式
                        _.isFunction(self.filter) && self.filter({
                            layoutData: self.layoutData,
                            index: a,
                            txt: txt,
                            line: line
                        });

                        self.rulesSprite.addChild(yNode);

                        //如果是resize的话也不要处理动画
                        if (self.animation && !self.resize) {
                            txt.animate({
                                globalAlpha: 1,
                                y: txt.context.y - 20
                            }, {
                                duration: 500,
                                easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                                delay: (a+1) * 80,
                                id: txt.id
                            });
                        } else {
                            txt.context.y = txt.context.y - 20;
                            txt.context.globalAlpha = 1;
                        }
                    }
                };

                //把 rulesSprite.children中多余的给remove掉
                if( self.rulesSprite.children.length > arr.length ){
                    for( var al = arr.length,pl = self.rulesSprite.children.length;al<pl;al++  ){
                        self.rulesSprite.getChildAt( al ).remove();
                        al--,pl--;
                    };
                };

                self.maxW += self.dis;

                //self.rulesSprite.context.x = self.maxW + self.pos.x;
                //self.pos.x = self.maxW + self.pos.x;
                if( self.width == null ){
                    if (self.line.enabled) {
                        self.width = self.maxW + self.dis + self.line.width + self.pos.x;
                    } else {
                        self.width = self.maxW + self.dis + self.pos.x;
                    }
                };
            },
            _getProp: function(s) {
                var res;
                if (_.isFunction(s)) {
                    res = s.call( this , this );
                }
                if( !res ){
                    res = "#999";
                }
                return res
            },
        };

        return yAxis;
    })

