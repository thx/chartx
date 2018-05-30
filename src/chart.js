import Canvax from "canvax"
import { getEl,parse2MatrixData } from "./utils/tools"
import DataFrame from "./utils/dataframe"
import theme from "./theme"

const _ = Canvax._;

const padding = 20;

export default class Chart extends Canvax.Event.EventDispatcher
{
    constructor( node, data, opts )
    {
        super( node, data, opts );

        this.Canvax = Canvax;
     
        this._node = node;
        //不管传入的是data = [ ['xfield','yfield'] , ['2016', 111]]
        //还是 data = [ {xfiled, 2016, yfield: 1111} ]，这样的格式，
        //通过parse2MatrixData最终转换的是data = [ ['xfield','yfield'] , ['2016', 111]] 这样 chartx的数据格式
        //后面有些地方比如 一些graphs中会使用dataFrame.org，， 那么这个dataFrame.org和_data的区别是，
        //_data是全量数据， dataFrame.org是_data经过dataZoom运算过后的子集
        this._data = parse2MatrixData(data);
        this._opts = opts;

        this.el = getEl(node) //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        this.width = parseInt(this.el.offsetWidth) //图表区域宽
        this.height = parseInt(this.el.offsetHeight) //图表区域高

        //padding 不支持用户设置， 主要是给内部组件比如 配置了 legend的话，
        //legend如果在top，就会把图表的padding.top修改，减去legend的height
        this.padding = {
            top: padding,
            right: padding,
            bottom: padding,
            left: padding
        };

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
        this.dataFrame = null; //每个图表的数据集合 都 存放在dataFrame中。

        this._theme = _.extend( [], theme.colors ); //theme.colors;  //皮肤对象，opts里面可能有theme皮肤组件

        this.init.apply(this, arguments);

    }

    init()
    {
    }

    draw()
    {
        /*
        this.initModule(); //初始化模块
        this.initComponents(); //初始化组件
        this.startDraw(); //开始绘图
        this.drawComponents();  //绘图完，开始绘制插件
        this.inited = true;
        */
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
        this._graphs = [];    //绘图组件清空
        this.canvax.domView.innerHTML = "";
        //padding数据也要重置为起始值
        this.padding = {
            top   : padding,
            right : padding,
            bottom: padding,
            left  : padding
        };
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

        this.reset({
            trigger : "resize"
        });

        this.inited = true;
    }

    /**
     * reset 其实就是重新绘制整个图表，不再做详细的拆分opts中有哪些变化，来做对应的细致的变化，简单粗暴的全部重新创立
     */
    reset(opts, data)
    {
        !opts && (opts={});

        _.extend(true, this._opts, opts);
        //和上面的不同this._opts存储的都是用户设置的配置
        //而下面的这个extend到this上面， this上面的属性都有包含默认配置的情况
        _.extend(true, this , opts);

        if( data ) {
            this._data = parse2MatrixData(data);
        };

        this.dataFrame = this.initData( this._data );

        this._clean();

        this._init && this._init(this._node, this._data, this._opts);
        this.draw( opts );

    }


    /*
     * 只响应数据的变化，不涉及配置变化
     * 
     * @dataTrigger 一般是触发这个data reset的一些场景数据，
     * 比如如果是 datazoom 触发的， 就会有 trigger数据{ name:'datazoom', left:1,right:1 }
     */
    resetData(data , dataTrigger)
    {
        if( data ){
            this._data = parse2MatrixData( data );
        };

        this.dataFrame = this.initData( this._data );

        this._resetData && this._resetData( dataTrigger );
        this.fire("resetData");
    }

   
    initData(data)
    {
        return DataFrame.apply(this, arguments);
    }


    //插件管理相关代码begin
    initComponents()
    {
        //TODO: theme 组件优先级最高，在initComponents之前已经加载过
        var notComponents = [ "coord", "graphs" , "theme" ];
        for( var _p in this._opts ){
            var p = _p.toLocaleLowerCase();
            if( _.indexOf( notComponents, p ) == -1 ){
                if( this[ "_init_components_"+p ] ){
                    this[ "_init_components_"+p ]( this._opts[ _p ] );
                };
            }
        }
    }

    //所有plug触发更新
    componentsReset( trigger )
    {
        var me = this;
        _.each(this.components , function( p , i ){

            if( trigger && trigger.name == p.type ){
                //如果这次reset就是由自己触发的，那么自己这个components不需要reset，负责观察就好
                return;
            };

            if( p.type == "dataZoom" ){
                p.plug.reset( {} , me._getCloneChart() );
                return;
            };

            p.plug.reset && p.plug.reset( me[ p.type ] || {} , me.dataFrame);
        }); 
    }

    drawComponents()
    {
        for( var i=0,l=this.components.length; i<l; i++ ){
            var p = this.components[i];
            p.plug && p.plug.draw && p.plug.draw();
            if( p.type == "once" ){
                this.components.splice( i, 1 );
                i--;
                //l--; l重新计算p.plug.draw 可能会改变components
            }
            l = this.components.length;
        }
    }

    getComponentsByType( type )
    {
        var arr = [];
        _.each( this.components, function( c ){
            if( c.type == type ){
                arr.push( c.plug )
            }
        } );
        return arr;
    }

    getComponentById( id )
    {
        var comp;
        _.each( this.components, function( c ){
            if( c.id == id ){
                comp = c;
                return false;
            }
        } );
        return comp ? comp.plug : null;
    }
    //插件相关代码end


}