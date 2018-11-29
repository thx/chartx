import Canvax from "canvax"
import { _ , dataFrame, dom , global } from "mmvis"

const _padding = 20;

export default class Chart extends Canvax.Event.EventDispatcher
{
    constructor( node, data, opt, componentModules )
    {
        super();

        this.componentModules = componentModules;
     
        this._node = node;
        this._data = data;
        this._opt = opt;

        this.dataFrame = this.initData( data , opt );

        this.el = dom.query(node) //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        this.width = parseInt(this.el.offsetWidth) //图表区域宽
        this.height = parseInt(this.el.offsetHeight) //图表区域高

        //legend如果在top，就会把图表的padding.top修改，减去legend的height
        this.padding = this._getPadding();

        //Canvax实例
		this.canvax = new Canvax.App({
		    el : this.el,
		    webGL : false
		});
        this.canvax.registEvent();


        this.id = "chartx_"+this.canvax.id;
        this.el.setAttribute("chart_id" , this.id);
        this.el.setAttribute("chartx_version", "2.0");

        
        //设置stage ---------------------------------------------------------begin
		this.stage = new Canvax.Display.Stage({
		    id: "main-chart-stage"
		});
        this.canvax.addChild( this.stage );
        //设置stage ---------------------------------------------------------end

        //构件好coord 和 graphs 的根容器
        this.setCoord_Graphs_Sp();
        
        //初始化_graphs为空数组
        this._graphs = [];

        //组件管理机制,所有的组件都绘制在这个地方
        this.components = [];
      
        this.inited = false;
        

        //先从全局皮肤里拿一组全局皮肤作为默认皮肤
        this._theme = _.extend( [], global.getGlobalTheme() );

        this.init.apply(this, arguments);
    }

    init()
    {
    }

    //create的时候调用没有opt参数
    //resize（opt=={resize : true}） 和 reset的时候会有 opt参数传过来
    draw( opt )
    {
        !opt && (opt = this._opt);

        //预处理各种配置
        this._pretreatmentOpt( opt );

        //初始化各个组件模块
        this._initModule( opt );
        this._startDraw( opt );
    }

    _pretreatmentOpt( opt ){
        if( !opt.resize ){
            //如果是resize的话，是不需要处理默认值的
            if( opt.graphs ){
                opt.graphs = _.flatten( [ opt.graphs ] );
            };

            //查找这个opt中的coord，调用对应的静态 setDefaultOpt 方法处理
            if( opt.coord && opt.coord.type ){
                var coordModule = this.componentModules.getComponentModule("coord", opt.coord.type);
                coordModule.setDefaultOpt( opt );
            };

            _.extend(true, this, opt);
        };
        return opt;
    }

    _initModule(opt)
    {
        var me = this;

        //优先处理皮肤组件
        if( this._opt.theme ){
            //如果用户有配置皮肤组件，优先级最高
            //皮肤就是一组颜色

            //假如用户就只传了一个颜色值
            if( !_.isArray( this._opt.theme ) ){
                this._opt.theme = [this._opt.theme];
            };
            var _theme = new this.componentModules.getComponentModule("theme")( this._opt.theme, this );
            this._theme = _theme.get(); //如果用户有设置图表皮肤组件，那么就全部用用户自己设置的，不再用merge 
        };

        //首先是创建一个坐标系对象
        //查找这个opt中的coord，调用对应的静态 setDefaultOpt 方法处理
        if( opt.coord && opt.coord.type ){
            var coordModule = me.componentModules.getComponentModule("coord", opt.coord.type);
            this._coord = new coordModule( opt.coord, me );
            this.coordSprite.addChild( this._coord.sprite );
        };

        _.each( opt.graphs , function( graphs ){
            var graphsModule = me.componentModules.getComponentModule("graphs", graphs.type);
            var _g = new graphsModule( graphs, me );
            me._graphs.push( _g );
            me.graphsSprite.addChild( _g.sprite );
        } );

        //PS: theme 组件优先级最高，在registerComponents之前已经加载过
        var highModules = [ "coord", "graphs" , "theme" ];
        for( var _p in this._opt ){
            //非coord graphs theme，其实后面也可以统一的
            if( _.indexOf( highModules, _p ) == -1 ){
                var _comp = this._opt[ _p ];

                //所有的组件都按照数组方式处理，这里，组件里面就不需要再这样处理了
                if( ! _.isArray( _comp ) ){
                    _comp = [ _comp ];
                };

                _.each( _comp, function( compOpt ){

                    var compConstructor = me.componentModules.getComponentModule( _p, compOpt.type );
                    var _comp = new compConstructor( compOpt, me );
                    me.components.push( _comp );
                    
                } );
                
            }
        };
    }

    _startDraw(opt)
    {
        
        var me = this;
        !opt && (opt ={});
        var _coord = this._coord;

        if( this._coord && this._coord.horizontal ){
            this._drawBeginHorizontal && this._drawBeginHorizontal();
        };

        var width = this.width - this.padding.left - this.padding.right;
        var height = this.height - this.padding.top - this.padding.bottom;
        var origin = { x : this.padding.left,y : this.padding.top }

        if( this._coord ){
            //先绘制好坐标系统
            this._coord.draw( opt );
            width  = this._coord.width;
            height = this._coord.height;
            origin = this._coord.origin;
        };

        if( this.dataFrame.length == 0 ){
            //如果没有数据，不需要绘制graphs
            me.fire("complete");
            return;
        };
    
        var graphsCount = this._graphs.length;
        var completeNum = 0;

        opt = _.extend( opt, {
            width  : width,
            height : height,
            origin : origin
        } );

        _.each( this._graphs, function( _g ){
            _g.on( "complete", function(g) {
                completeNum ++;
                if( completeNum == graphsCount ){
                    me.fire("complete");
                }
                _g.inited = true;
            });
            _g.draw( opt );
        } );


        //绘制除开coord graphs 以外的所有组件
        for( var i=0,l=this.components.length; i<l; i++ ){
            var p = this.components[i];
            p.draw( opt );

            /*
            p.plug && p.plug.draw && p.plug.draw(  );
            p.plug.app = this;
            if( p.type == "once" ){
                this.components.splice( i, 1 );
                i--;
                //l--; l重新计算p.plug.draw 可能会改变components
            }
            l = this.components.length;
            */
        };

        this._bindEvent();

        if( this._coord && this._coord.horizontal ){
            this._drawEndHorizontal && this._drawEndHorizontal();
        };

    }

    _drawBeginHorizontal()
    {
        //横向了之后， 要把4个padding值轮换一下
        //top,right 对调 ， bottom,left 对调
        var padding = this.padding;
        
        var num = padding.top;
        padding.top = padding.right;
        padding.right = padding.bottom;
        padding.bottom = padding.left;
        padding.left = num;

    }
 

    //绘制完毕后的横向处理
    _drawEndHorizontal() 
    {
        var me = this;

        var ctx = me.graphsSprite.context;
        ctx.x += ((me.width - me.height) / 2);
        ctx.y += ((me.height - me.width) / 2);
        ctx.rotation = 90;
        ctx.rotateOrigin = { x : me.height/2, y : me.width/2 };
        
        function _horizontalText( el ){
            
            if( el.children ){
                _.each( el.children, function( _el ){
                    _horizontalText( _el );
                } )
            };
            if( el.type == "text" ){
                
                var ctx = el.context;
                var w = ctx.width;
                var h = ctx.height;

                ctx.rotation = ctx.rotation - 90;
                
            };
        }

        _.each(me._graphs, function( _graphs ) {
            _horizontalText( _graphs.sprite );
        });
    }

    _getPadding(){
        
        var paddingVal = _padding;
        if( this._opt.coord && "padding" in this._opt.coord ){
            if( !_.isObject(this._opt.coord.padding) ){
                paddingVal = this._opt.coord.padding;
            }
        };
        var paddingObj = {
            top: paddingVal,
            right: paddingVal,
            bottom: paddingVal,
            left: paddingVal
        };
        
        if( this._opt.coord && "padding" in this._opt.coord ){
            if( _.isObject(this._opt.coord.padding) ){
                paddingObj = _.extend( paddingObj, this._opt.coord.padding )
            }
        };

        return paddingObj;
    }

    //ind 如果有就获取对应索引的具体颜色值
    getTheme( ind )
    {
        var colors = this._theme;
        if( ind != undefined ){
            return colors[ ind % colors.length ] || "#ccc";
        };
        return colors;
    }

    setCoord_Graphs_Sp()
    {
        //坐标系存放的容器
        this.coordSprite = new Canvax.Display.Sprite({
            id: 'coordSprite'
        });
        this.stage.addChild( this.coordSprite );

        //graphs管理
        this.graphsSprite = new Canvax.Display.Sprite({
            id: 'graphsSprite'
        });
        this.stage.addChild( this.graphsSprite );
    }

    /*
     * chart的销毁
     */
    destroy() 
    {
        this._clean();
        if( this.el ){
            this.el.removeAttribute("chart_id");
            this.el.removeAttribute("chartx_version");
            this.canvax.destroy();
            this.el = null;
        };
        this._destroy && this._destroy();
        this.fire("destroy");
    }

    /*
     * 清除整个图表
     **/
    _clean()
    {
        //保留所有的stage，stage下面得元素全部 destroy 掉
        for (var i=0,l=this.canvax.children.length;i<l;i++){
            var stage = this.canvax.getChildAt(i);
            for( var s = 0 , sl=stage.children.length ; s<sl ; s++){
                stage.getChildAt(s).destroy();
                s--;
                sl--;
            }
        };

        //因为上面的destroy把 this.coordSprite 和 this.graphsSprite 这两个预设的容器给destroy了
        //所以要重新设置一遍准备好。
        this.setCoord_Graphs_Sp();

        this.components = []; //组件清空
        this._coord = null;   //坐标系清空
        this._graphs = [];    //绘图组件清空
        this.canvax.domView.innerHTML = "";
        //padding数据也要重置为起始值
        this.padding = this._getPadding();
    }

    /**
     * 容器的尺寸改变重新绘制
     */
    resize()
    {
        var _w = parseInt(this.el.offsetWidth);
        var _h = parseInt(this.el.offsetHeight);
        if( _w == this.width && _h == this.height ) return;
        
        this.width = _w;
        this.height = _h;
        this.canvax.resize();
        this.inited = false;

        this._clean();
        this.draw( {
            resize : true
        } );

        this.inited = true;
    }

    /**
     * reset 其实就是重新绘制整个图表，不再做详细的拆分opts中有哪些变化，来做对应的细致的变化，简单粗暴的全部重新创立
     */
    reset(opt, data)
    {
        !opt && (opt={});

        _.extend(true, this._opt, opt);

        //和上面的不同this._opts存储的都是用户设置的配置
        //而下面的这个extend到this上面， this上面的属性都有包含默认配置的情况
        _.extend(true, this , opt);

        if( data ) {
            this._data = data;
        };

        this.dataFrame = this.initData( this._data, opt );

        this._clean();
        this.draw( opt );

    }

    /*
     * 只响应数据的变化，不涉及配置变化
     * 
     * @trigger 一般是触发这个data reset的一些场景数据，
     * 比如如果是 datazoom 触发的， 就会有 trigger数据{ name:'datazoom', left:1,right:1 }
     */
    resetData(data , trigger)
    {
        var me = this;

        var preDataLenth = this.dataFrame.length;
        if( data ){
            this._data = data;
            this.dataFrame = this.initData( this._data );
        };

        if( !preDataLenth ){
            //如果之前的数据为空， 那么我们应该这里就直接重绘吧
            this._clean();
            this.draw( this._opt );
            return;
        };
        
        if( this._coord ){
            this._coord.resetData( this.dataFrame , trigger);
        };
        _.each( this._graphs, function( _g ){
            _g.resetData( me.dataFrame , trigger);
        } );

        this.componentsReset( trigger );

        this.fire("resetData");
    }

   
    initData()
    {
        return dataFrame.apply(this, arguments);
    }


    //TODO:除开 coord,graphs 其他所有plug触发更新其实后续也要统一
    componentsReset( trigger )
    {
        var me = this;
        _.each(this.components , function( p , i ){
            if( trigger && trigger.comp && trigger.comp.__cid == p.__cid ){
                //如果这次reset就是由自己触发的，那么自己这个components不需要reset，负责观察就好
                return;
            };
            p.reset && p.reset( me[ p.type ] || {} , me.dataFrame);
        });
    }


    getComponentsByName( name ){
        var arr = [];
        _.each( this.components, function( c ){
            if( c.name == name ){
                arr.push( c )
            };
        } );
        return arr;
    }

    getComponentById( id )
    {
        var comp;
        _.each( this.components, function( c ){
            if( c.id && c.id == id ){
                comp = c;
                return false;
            }
        } );
        return comp;
    }
    //插件相关代码end


    //从graphs里面去根据opt做一一对比，比对成功为true
    //getGraphsByType,getGraphById 可以逐渐淘汰
    //count为要查询的数量， 如果为1，则
    getGraph( opt ){
        var graphs = this.getGraphs( opt );
        return graphs[0];
    }

    getGraphs( opt ){
        var arr = [];
        var expCount = 0;
        for( var p in opt ){
            expCount++;
        };

        _.each( this._graphs, function( g ){
            for( var p in opt ){
                if( JSON.stringify( g[p] ) == JSON.stringify( opt[p] ) ){
                    expCount--
                };
            };
            if( !expCount ){
                arr.push( g );
            };
        } );
        
        return arr;
    }

    //获取graphs列表根据type
    getGraphsByType( type )
    {
        var arr = [];
        _.each( this._graphs, function( g ){
            if( g.type == type ){
                arr.push( g )
            }
        } );
        return arr;
    }

    //获取graphs根据id
    getGraphById( id )
    {
        var _g;
        _.each( this._graphs, function( g ){
            if( g.id == id ){
                _g = g;
                return false;
            }
        } );
        return _g;
    }


    //从coord里面去根据opt做一一对比，比对成功为true
    //目前没有多个坐标系的图表，所以不需要 getCoords 
    getCoord( opt )
    {
        return this._coord;
    }

    //只有field为多组数据的时候才需要legend，给到legend组件来调用
    getLegendData()
    {
        var me   = this;
        var data = [];
        
        _.each( _.flatten(me._coord.fieldsMap) , function( map , i ){
            //因为yAxis上面是可以单独自己配置field的，所以，这部分要过滤出 legend data
            var isGraphsField = false;
            _.each( me.graphs, function( gopt ){
                if( _.indexOf( _.flatten([ gopt.field ]), map.field ) > -1 ){
                    isGraphsField = true;
                    return false;
                }
            } );

            if( isGraphsField ){
                data.push( {
                    enabled : map.enabled,
                    name    : map.field,
                    field   : map.field,
                    ind     : map.ind,
                    color   : map.color,
                    yAxis   : map.yAxis
                } );
            }
        });
        return data;
    }

    show( field , trigger )
    {
        var me = this;
        this._coord.show( field, trigger );
        _.each( this._graphs, function( _g ){
            _g.show( field , trigger);
        } );
        this.componentsReset( trigger );
    }

    hide( field , trigger)
    {
        var me = this;
        this._coord.hide( field ,trigger );
        _.each( this._graphs, function( _g ){
            _g.hide( field , trigger );
        } );
        this.componentsReset( trigger );
    }


    _bindEvent()
    {
        var me = this;
        this.on("panstart mouseover", function(e) {
            debugger
            var _tips = me.getComponentsByName("tips")[0];
            if ( _tips ) {
                me._setTipsInfo.apply(me, [e]);
                _tips.show(e);
                me._tipsPointerAtAllGraphs( e );
            };
        });
        this.on("panmove mousemove", function(e) {
            var _tips = me.getComponentsByName("tips")[0];
            if ( _tips ) {
                me._setTipsInfo.apply(me, [e]);
                _tips.move(e);
                me._tipsPointerAtAllGraphs( e );
            };
        });
        this.on("panend mouseout", function(e) {
            //如果e.toTarget有货，但是其实这个point还是在induce 的范围内的
            //那么就不要执行hide，顶多只显示这个点得tips数据
            var _tips = me.getComponentsByName("tips")[0];
            if ( _tips && !( e.toTarget && me._coord && me._coord.induce && me._coord.induce.containsPoint( me._coord.induce.globalToLocal(e.target.localToGlobal(e.point) )) )) {
                _tips.hide(e);
                me._tipsPointerHideAtAllGraphs( e );
            };
        });
        this.on("tap", function(e) {
            var _tips = me.getComponentsByName("tips")[0];
            if ( _tips ) {
                _tips.hide(e);
                me._setTipsInfo.apply(me, [e]);
                _tips.show(e);
                me._tipsPointerAtAllGraphs( e );
            };
        });
    }

    //默认的基本tipsinfo处理，极坐标和笛卡尔坐标系统会覆盖
    _setTipsInfo(e)
    {
         if( !e.eventInfo ){
             e.eventInfo = {};
         };

         if( this._coord ){
            e.eventInfo = this._coord.getTipsInfoHandler(e);
         };

         //如果具体的e事件对象中有设置好了得 e.eventInfo.nodes，那么就不再遍历_graphs去取值
        //比如鼠标移动到多柱子组合的具体某根bar上面，e.eventInfo.nodes = [ {bardata} ] 就有了这个bar的数据
        //那么tips就只显示这个bardata的数据
        if( !e.eventInfo.nodes || !e.eventInfo.nodes.length ){
            var nodes = [];
            var iNode = e.eventInfo.xAxis.ind;
            _.each( this._graphs, function( _g ){
                nodes = nodes.concat( _g.getNodesAt( iNode ) );
            } );
            e.eventInfo.nodes = nodes;
        };
       
     }
 
     //把这个point拿来给每一个graphs执行一次测试，给graphs上面的shape触发激活样式
     _tipsPointerAtAllGraphs( e )
     {
         _.each( this._graphs, function( _g ){
             _g.tipsPointerOf( e );
         });
     }
 
     _tipsPointerHideAtAllGraphs( e )
     {
         _.each( this._graphs, function( _g ){
             _g.tipsPointerHideOf( e );
         });
     }
}