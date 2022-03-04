import global from "./global"
import Canvax from "canvax"
import dataFrame from "./core/dataFrame"
import setting from './setting';
import Coord from "./components/coord/index"

let { _ , $ , event } = Canvax;


class Chart extends event.Dispatcher
{
    //node 为外部宿主的id 或者 dom节点
    //也可能就是外部已经创建好的 canvax对象 { canvax（实例）, stage, width, height }
    constructor( node, data, opt, componentModules )
    {
        super();

        this.componentModules = componentModules;
     
        this._node = node;
        this._data = data;
        this._opt = this.polyfill(opt);
  
        this.dataFrame = this.initData( data , opt );

        //legend如果在top，就会把图表的padding.top修改，减去legend的height
        this.padding = null;

        //node可能是意外外面一件准备好了canvax对象， 包括 stage  width height 等
        this.el = $.query(node) //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        this.width = node.width || parseInt(this.el.offsetWidth) //图表区域宽
        this.height = node.height || parseInt(this.el.offsetHeight) //图表区域高

        //Canvax实例

        if( !node.canvax ){
        
            this.canvax = new Canvax.App({
                el : this.el,
                webGL : false
            });
            this.canvax.registEvent();

            this.id = "chartx_"+this.canvax.id;
            this.el.setAttribute("chart_id" , this.id);

            //设置stage ---------------------------------------------------------begin
            this.stage = new Canvax.Display.Stage({
                id: "main-chart-stage"
            });
            this.canvax.addChild( this.stage );
            //设置stage ---------------------------------------------------------end

        } else {
            this.canvax = node.canvax;
            this.stage  = node.stage;
        };

        //构件好coord 和 graphs 的根容器
        this.setCoord_Graphs_Sp();

        //这三类组件是优先级最高的组件，所有的组件的模块化和绘制，都要一次在这三个完成后实现
        this.__highModules = [ "theme", "coord", "graphs" ];
        
        //组件管理机制,所有的组件都绘制在这个地方
        this.components = [];
      
        this.inited = false;
    
        this.init();
    }

    polyfill( opt ){
        for( let compName in opt ){
            let comps = _.flatten([ opt[compName] ]);
            comps.forEach( comp => {
                let compModule = this.componentModules.get(compName, comp.type);
                compModule && compModule.polyfill( comp );
            });
        }
        
        return opt;
    }

    init()
    {
        let me = this;

        //init全部用 this._opt
        let opt = this._opt;

        //padding数据也要重置为起始值
        this.padding = this._getPadding();
        this._initPadding = JSON.parse( JSON.stringify( this.padding ) );

        //首先判断如果没有coord配置，那么就配置一个空坐标系，所有的图表都会依赖一个坐标系， 哪怕是个空坐标系
        if( !opt.coord ){
            let _coord = new Coord( {}, me );
            _coord.init();
            me.components.push( _coord );
        };

        //先依次init 处理 "theme", "coord", "graphs" 三个优先级最高的模块
        _.each( this.__highModules, function( compName ){
            if( !opt[compName] ) return;
            let comps = _.flatten([ opt[compName] ]);

            //them是一个数组的组件。so特殊处理
            if( compName == "theme" ){
                comps = [ comps ];
            };
            
            _.each( comps, function( comp ){
            
                if( //没有type的coord和没有field(or keyField)的graphs，都无效，不要创建该组件
                    //关系图中是keyField
                    //(compName == "coord" && !comp.type ) || 
                    compName == "graphs" && 
                    !comp.field && 
                    !comp.keyField && 
                    !comp.adcode && 
                    !comp.geoJson && 
                    !comp.geoJsonUrl  //地图的话只要有个adcode就可以了
                ) return; 
                
                let compModule = me.componentModules.get(compName, comp.type);
                if( compModule ){

                    let _comp = new compModule( comp, me );

                    //可能用户配置了一个空的coord坐标系，没有type，里面配置了一些fieldsConfig之类的全局配置的时候
                    //就要手动init一下这个空坐标系
                    if( compName == 'coord' && !comp.type ){
                        //空坐标组件， 就要手动调用一下组件的init()
                        _comp.init();
                    };

                    me.components.push( _comp );
                };
            } );
        } );

        //PS: theme 组件优先级最高，在registerComponents之前已经加载过
        for( let _p in this._opt ){
            //非coord graphs theme，其实后面也可以统一的
            if( _.indexOf( this.__highModules, _p ) == -1 ){
                let comps = this._opt[ _p ];
                //所有的组件都按照数组方式处理，这里，组件里面就不需要再这样处理了
                if( ! _.isArray( comps ) ){
                    comps = [ comps ];
                }; 
                _.each( comps, function( comp ){
                    let compModule = me.componentModules.get( _p, comp.type );
                    if( compModule ){
                        let _comp = new compModule( comp, me );
                        me.components.push( _comp );
                    }
                } );
            }
        };
    }

    
    draw( _opt )
    {
        let me = this;
        let opt = Object.assign( {}, ( _opt || {} ) );
        let _coord = this.getComponent({name:'coord'});

        if( _coord && _coord.horizontal ){
            this._drawBeginHorizontal();
        };

        let width = this.width - this.padding.left - this.padding.right;
        let height = this.height - this.padding.top - this.padding.bottom;
        let origin = { x : this.padding.left,y : this.padding.top }

        if( _coord ){
            //先绘制好坐标系统
            _coord.draw( opt );
            width  = _coord.width;
            height = _coord.height;
            origin = _coord.origin;
        };

        //if( this.dataFrame.length == 0 ){
            //如果没有数据，不需要绘制graphs
            //me.fire("complete");
            //return;
        //};
    
        let _graphs = this.getComponents({name:'graphs'});
        let graphsCount = _graphs.length;
        let completeNum = 0;

        opt = _.extend( opt, {
            width  : width,
            height : height,
            origin : origin
        } );

        //没有数据的时候可以不绘制graphs，但是下面的其他components还是需要绘制的，比如图例
        if( this.dataFrame.length > 0 ){
            _.each( _graphs, function( _g ){
                _g.on( "complete", function(g) {
                    completeNum ++;
                    if( completeNum == graphsCount ){
                        me.fire("complete");
                    };
                    _g.inited = true;
                });
                _g.draw( opt );
            } );
        };

        //绘制除开coord graphs 以外的所有组件
        for( let i=0,l=this.components.length; i<l; i++ ){
            let p = this.components[i];
            if( _.indexOf( this.__highModules, p.name ) == -1 ){
                p.draw( opt );
            };
        };

        this._bindEvent();

        if( _coord && _coord.horizontal ){
            this._drawEndHorizontal();
        };

    }

    _drawBeginHorizontal()
    {
        //横向了之后， 要把4个padding值轮换一下
        //top,right 对调 ， bottom,left 对调
        let padding = this.padding;
        
        let num = padding.top;
        padding.top = padding.right;
        padding.right = padding.bottom;
        padding.bottom = padding.left;
        padding.left = num;

    }
 

    //绘制完毕后的横向处理
    _drawEndHorizontal() 
    {
        let ctx = this.graphsSprite.context;
        ctx.x += ((this.width - this.height) / 2);
        ctx.y += ((this.height - this.width) / 2);
        ctx.rotation = 90;
        ctx.rotateOrigin = { x : this.height/2, y : this.width/2 };
        
        this._horizontalGraphsText();
    }

    _horizontalGraphsText(){
        let me = this;
        function _horizontalText( el ){
            
            if( el.children ){
                _.each( el.children, function( _el ){
                    _horizontalText( _el );
                } )
            };
            if( el.type == "text" && !el.__horizontal ){
                
                let ctx = el.context;
                ctx.rotation = ctx.rotation - 90;
                el.__horizontal = true;
                
            };
        }

        _.each(me.getComponents({name:'graphs'}), function( _graphs ) {
            _horizontalText( _graphs.sprite );
        });
    }

    _getPadding(){
        
        let paddingVal = setting.padding;

        if( this._opt.coord && "padding" in this._opt.coord ){
            if( !_.isObject(this._opt.coord.padding) ){
                paddingVal = this._opt.coord.padding;
            }
        };

        let paddingObj = {
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
        let colors = global.getGlobalTheme();
        let _theme = this.getComponent({name:'theme'});
        if( _theme ) {
            colors = _theme.get();
        };
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
        this.clean();
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
    clean()
    {
        //保留所有的stage，stage下面得元素全部 destroy 掉
        for (let i=0,l=this.canvax.children.length;i<l;i++){
            let stage = this.canvax.getChildAt(i);
            for( let s = 0 , sl=stage.children.length ; s<sl ; s++){
                stage.getChildAt(s).destroy();
                s--;
                sl--;
            }
        };

        //因为上面的destroy把 this.coordSprite 和 this.graphsSprite 这两个预设的容器给destroy了
        //所以要重新设置一遍准备好。
        this.setCoord_Graphs_Sp();

        this.components = []; //组件清空
        this.canvax.domView && (this.canvax.domView.innerHTML = "");

        //清空事件的当前状态
        if(this.canvax.event){
            this.canvax.event.curPointsTarget = []
        }

        this.padding = this._initPadding;
    }

    /**
     * 容器的尺寸改变重新绘制
     */
    resize()
    {
        let _w = parseInt(this.el.offsetWidth);
        let _h = parseInt(this.el.offsetHeight);
        if( _w == this.width && _h == this.height ) return;
        
        this.width = _w;
        this.height = _h;
        this.canvax.resize();
        this.inited = false;

        this.clean();
        this.init();
        this.draw( {
            resize : true
        } );

        this.inited = true;
    }

    /**
     * reset 其实就是重新绘制整个图表，不再做详细的拆分opts中有哪些变化，来做对应的细致的变化，简单粗暴的全部重新创立
     * opt 必须全量options，不在支持局部opt传递，所以对opt的处理不再支持extend
     */
    reset(opt, data)
    {
        
        opt && (this._opt = opt);
        
        /* 不能 extend opt 
        !opt && (opt={});
        _.extend(this._opt, opt);
        */

        data && (this._data = data);
    
        this.dataFrame = this.initData( this._data, opt );

        this.clean();
        this.init();
        this.draw();

    }

    /*
     * 只响应数据的变化，不涉及配置变化
     * 
     * @trigger 一般是触发这个data reset的一些场景数据，内部触发才会有，比如datazoom， tree的收缩节点
     * 外部调用resetData的时候，是只会传递第一个data数据的
     * 比如如果是 datazoom 触发的， 就会有 trigger数据{ name:'datazoom', left:1,right:1 }
     */
    resetData(data , trigger)
    {
        let me = this;

        let preDataLenth = this.dataFrame.org.length;

        if( !trigger || !trigger.comp ){
            //直接chart级别的resetData调用
            //只有非内部trigger的的resetData，才会有原数据的改变， 
            if( !data ){
                data = [];
            };
            this._data = data; //注意，resetData不能为null，必须是 数组格式
            this.dataFrame.resetData( data );

            // if( !data.length ){
            //     debugger
            //     this.clean();
            //     this.init();
            //     this.draw( this._opt );
            //     this.fire("resetData");
            //     return;
            // };

            
        } else {
            //内部组件trigger的话，比如datazoom
            this.dataFrame.resetData();
        };
        
        
        //console.log( this.dataFrame )
        let graphsList = this.getComponents({name:'graphs'});
        let allGraphsHasResetData = true;
        _.each(graphsList, function( _g ){
            if( !_g.resetData && allGraphsHasResetData ){
                allGraphsHasResetData = false;
                return false;
            }
        });

        if( !preDataLenth || !allGraphsHasResetData ){
            //如果之前的数据为空， 那么我们应该这里就直接重绘吧
            //如果有其中一个graphs没实现resetData 也 重绘
            this.clean();
            this.init();
            this.draw( this._opt );
            this.fire("resetData");
            return;
        };
    
        let _coord = this.getComponent({name:'coord'})
        if( _coord ){
            _coord.resetData( this.dataFrame , trigger);
        };
        _.each( graphsList, function( _g ){
            _g.resetData( me.dataFrame , trigger);
        } );

        this.componentsReset( trigger );

        if( _coord && _coord.horizontal ){
            this._horizontalGraphsText();
        };

        this.fire("resetData");
    
    }
     
    initData()
    {
        return dataFrame.apply(this, arguments);
    }

    componentsReset( trigger )
    {
        let me = this;
        
        _.each(this.components , function( p , i ){
            //theme coord graphs额外处理
            if( _.indexOf( me.__highModules, p.name ) != -1 ){
                return
            };
            if( trigger && trigger.comp && trigger.comp.__cid == p.__cid ){
                //如果这次reset就是由自己触发的，那么自己这个components不需要reset，负责观察就好
                return;
            };
            p.reset && p.reset( me[ p.type ] || {} , me.dataFrame);
        });
    }

    getComponentById( id )
    {
        let comp;
        _.each( this.components, function( c ){
            if( c.id && c.id == id ){
                comp = c;
                return false;
            }
        } );
        return comp;
    }

    getComponent( opt ){
        return this.getComponents( opt )[0];
    }

    getComponents( opt, components ){
        let arr = [];
        let expCount = 0;
        if( !components ){
            components = this.components;
        };

        for( let p in opt ){
            expCount++;
        };

        if( !expCount ){
            return components;
        };

        _.each( components, function( comp ){
            let i = 0;
            for( let p in opt ){
                if( JSON.stringify( comp[p] ) == JSON.stringify( opt[p] ) ){
                    i++;
                };
            };
            if( expCount == i ){
                arr.push( comp );
            };
        } );
        
        return arr;
    }
    
    //从graphs里面去根据opt做一一对比，比对成功为true
    //count为要查询的数量， 如果为1，则
    getGraph( opt ){
        let graphs = this.getGraphs( opt );
        return graphs[0];
    }

    getGraphs( opt ){
        return this.getComponents( opt, this.getComponents({name:'graphs'}) );
    }

    //获取graphs根据id
    getGraphById( id )
    {
        let _g;
        _.each( this.getComponents({name:'graphs'}), function( g ){
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
        return this.getComponent(_.extend( true, {name:'coord'}, opt ));
    }

    //只有field为多组数据的时候才需要legend，给到legend组件来调用
    getLegendData()
    {
        let me   = this;
        let data = [];

        //这里涌来兼容pie等的图例，其实后续可以考虑后面所有的graphs都提供一个getLegendData的方法
        _.each( this.getComponents({name:'graphs'}), function( _g ){
            _.each( _g.getLegendData(), function( item ){
                
                if( _.find( data , function( d ){
                    return d.name == item.name
                } ) ) return;

                let legendItem = _.extend(true, {
                    enabled: true
                }, item);
                legendItem.color = item.fillStyle || item.color || item.style;

                data.push( legendItem )
            } );
        } );
        if( data.length ){
            return data;
        };

        //------------------------------------------------------------//

        let _coord = me.getComponent({name:'coord'});
         
        _.each( _.flatten( _coord.graphsFieldsMap ) , function( map , i ){
            //因为yAxis上面是可以单独自己配置field的，所以，这部分要过滤出 legend data
            let isGraphsField = false;
            _.each( me._opt.graphs, function( gopt ){
                if( _.indexOf( _.flatten([ gopt.field ]), map.field ) > -1 ){
                    isGraphsField = true;
                    return false;
                }
            } );

            if( isGraphsField ){
                data.push( {
                    enabled : map.enabled,
                    name    : map.name || map.field,
                    field   : map.field,
                    ind     : map.ind,
                    color   : map.color,
                    type    : map.type,
                    yAxis   : map.yAxis
                } );
            }
        });
        
        return data;
    }

    show( field , trigger )
    {
        let _coord = this.getComponent({name:'coord'});
        _coord && _coord.show( field, trigger );
        _.each( this.getComponents({name:'graphs'}), function( _g ){
            _g.show( field , trigger);
        } );
        this.componentsReset( trigger );
    }

    hide( field , trigger)
    {
        let _coord = this.getComponent({name:'coord'});
        _coord && _coord.hide( field ,trigger );
        _.each( this.getComponents({name:'graphs'}), function( _g ){
            _g.hide( field , trigger );
        } );
        this.componentsReset( trigger );
    }

    triggerEvent( event ){
        //触发每个graphs级别的事件（在 graph 上面 用 on 绑定的事件），
        //用户交互事件先执行，还可以修改e的内容修改tips内容(e.eventInfo)
        if( event.eventInfo ){
            _.each( this.getGraphs(), function( graph ){
                graph.triggerEvent( event );
            } );
        };
        
        let _tips = this.getComponent({name:'tips'});
        let _coord = this.getComponent({name:'coord'});

        if( _tips ){
            
            this._setGraphsTipsInfo.apply(this, [event]);

            if( 'mouseover,mousedown,tap,longTap'.indexOf( event.type ) > -1 ){
                _tips.show(event);
                this._tipsPointerAtAllGraphs( event );
            };
            if( 'mousemove,touchMove'.indexOf( event.type ) > -1 ){
                _tips.move(event);
                this._tipsPointerAtAllGraphs( event );
            };
            if( 'mouseout'.indexOf( event.type ) > -1 && !( event.toTarget && _coord && _coord.induce && _coord.induce.containsPoint( _coord.induce.globalToLocal(event.target.localToGlobal(event.point) )) ) ){
                _tips.hide(event);
                this._tipsPointerHideAtAllGraphs( event );
            };

        };
    }


    _bindEvent()
    { 
        if( this.__bindEvented ) return;
        this.on(event.types.get() , (e)=>{
            //先触发自己的事件
            this.triggerEvent( e );

            //然后
            //如果这个图表的tips组件有设置linkageName，
            //那么就寻找到所有的图表实例中有相同linkageName的图表，执行相应的事件
            let tipsComp = this.getComponent({name:"tips"});
            if( tipsComp && tipsComp.linkageName ){
                for( let c in global.instances ){
                    let linkageChart = global.instances[ c ];

                    if( linkageChart == this ) continue;

                    let linkageChartTipsComp = linkageChart.getComponent({name:"tips"});
                    if( linkageChartTipsComp && linkageChartTipsComp.linkageName && linkageChartTipsComp.linkageName == tipsComp.linkageName ){
                        if(e.eventInfo && e.eventInfo.nodes){
                            e.eventInfo.nodes = []
                        };
                        //告诉tips的content这个是联动触发（被动）
                        e.eventInfo.isLinkageTrigger = true;
                        linkageChart.triggerEvent.apply( linkageChart, [e] );
                    }
                }
            };
            
        });

        //一个项目只需要bind一次
        this.__bindEvented = true;
    }


    //默认的基本tipsinfo处理，极坐标和笛卡尔坐标系统会覆盖
    _setGraphsTipsInfo(e)
    {
        if( !e.eventInfo ){
            e.eventInfo = {};
        };

        let _coord = this.getComponent({name:'coord'});
        if( _coord ){
            e.eventInfo = _coord.getTipsInfoHandler(e);
        };

        if( !("tipsEnabled" in e.eventInfo) ){
            e.eventInfo.tipsEnabled = true; //默认都开始tips
        }; 

        //如果具体的e事件对象中有设置好了得 e.eventInfo.nodes，那么就不再遍历_graphs去取值
        //比如鼠标移动到多柱子组合的具体某根bar上面，e.eventInfo.nodes = [ {bardata} ] 就有了这个bar的数据
        //那么tips就只显示这个bardata的数据
        if( !e.eventInfo.nodes || !e.eventInfo.nodes.length ){
            let nodes = [];
            let iNode = e.eventInfo.iNode;
            
            _.each( this.getComponents({name:'graphs'}), function( _g ){
                if( _g.getNodesAt && iNode !== undefined ){
                    nodes = nodes.concat( _g.getNodesAt( iNode, e ) );
                }
            } );
            e.eventInfo.nodes = nodes;
        };
     }
 
     //把这个point拿来给每一个graphs执行一次测试，给graphs上面的shape触发激活样式
     _tipsPointerAtAllGraphs( e )
     {
         _.each( this.getComponents({name:'graphs'}), function( _g ){
             _g.tipsPointerOf( e );
         });
     }
 
     _tipsPointerHideAtAllGraphs( e )
     {
         _.each( this.getComponents({name:'graphs'}), function( _g ){
             _g.tipsPointerHideOf( e );
         });
     }
     
};

global.registerComponent( Chart, 'chart' );

export default Chart;