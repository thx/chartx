
import { global,_ } from "mmvis"
global.layout || ( global.layout = {} );


import Chart from "./chart"

//-----------------------------------------------

//坐标系
import Rect from "./components/coord/rect"
import Polar from "./components/coord/polar"
//-----------------------------------------------

//graphs
import Bar from "./components/graphs/bar/index"
import Line from "./components/graphs/line/index"
import Scat from "./components/graphs/scat/index"
import Pie from "./components/graphs/pie/index"
import Radar from "./components/graphs/radar/index"
import Cloud from "./components/graphs/cloud/index"
import Planet from "./components/graphs/planet/index"
import Funnel from "./components/graphs/funnel/index"
import Venn from "./components/graphs/venn/index"
import Sunburst from "./components/graphs/sunburst/index"
import Sankey from "./components/graphs/sankey/index"
import Progress from "./components/graphs/progress/index"

/*
import Relation from "./components/graphs/relation/index"
import dagre from "dagre"
global.layout.dagre = dagre;
*/

//-----------------------------------------------
//components
import Legend from "./components/legend/index"
import DataZoom from "./components/datazoom/index"
import MarkLine from "./components/markline/index"
import Tips from "./components/tips/index"
import BarTgi from "./components/bartgi/index"
import BarGuide from "./components/barguide/index"
import Theme from "./components/theme/index"
import WaterMark from "./components/watermark/index"
import Cross from "./components/cross/index"
import lineSchedu from "./components/lineschedu/index"
import markCloumn from "./components/markcloumn/index"


global.registerComponent( Chart, 'chart' );

//global.registerComponent( emptyCoord, 'coord' );
global.registerComponent( Rect, 'coord', 'rect' );
global.registerComponent( Polar, 'coord', 'polar' );

global.registerComponent( Bar, 'graphs', 'bar' );
global.registerComponent( Line, 'graphs', 'line' );
global.registerComponent( Scat, 'graphs', 'scat' );
global.registerComponent( Pie, 'graphs', 'pie' );
global.registerComponent( Radar, 'graphs', 'radar' );
global.registerComponent( Cloud, 'graphs', 'cloud' );
global.registerComponent( Planet, 'graphs', 'planet' );
global.registerComponent( Funnel, 'graphs', 'funnel' );
global.registerComponent( Venn, 'graphs', 'venn' );
global.registerComponent( Sunburst, 'graphs', 'sunburst' );
global.registerComponent( Sankey, 'graphs', 'sankey' );
global.registerComponent( Progress, 'graphs', 'progress' );

//global.registerComponent( Relation, 'graphs', 'relation' );

global.registerComponent( Theme, 'theme' );
global.registerComponent( Legend, 'legend' );
global.registerComponent( DataZoom, 'dataZoom' );
global.registerComponent( MarkLine, 'markLine' );
global.registerComponent( Tips, 'tips' );
global.registerComponent( BarTgi, 'barTgi' );
global.registerComponent( BarGuide, 'barGuide' );
global.registerComponent( WaterMark, 'waterMark' );
global.registerComponent( Cross, 'cross' );
global.registerComponent( lineSchedu, 'lineSchedu' );
global.registerComponent( markCloumn, 'markcloumn' );

//皮肤设定begin ---------------
//如果数据库中有项目皮肤
var projectTheme = []; //从数据库中查询出来设计师设置的项目皮肤
if( projectTheme && projectTheme.length ){
    global.setGlobalTheme( projectTheme );
};
//皮肤设定end -----------------


var chartx = {
    options : {}
};

for( var p in global ){
    chartx[ p ] = global[ p ];
};



//计算全量的 props 属性用来提供智能提示 begin
//这部分代码没必要部署到 打包的环境， 只是chartpark需要用来做智能提示， 自动化测试
var allProps = {};
var allModules = global._getComponentModules().modules;

for( var n in allModules ){
    if( n == 'chart' ) continue;

    allProps[n] = {
        detail : n,
        propertys : {}
        //typeMap: {}
    };

    var _graphNames;
    if( n == 'graphs' ){
        _graphNames = _.map( allModules.graphs, function(val,key){return key} );
        allProps.graphs.documentation = "可选的graphs类型有：\n" + _graphNames.join('\n');
    };

    var allConstructorProps = {}; //整个原型链路上面的 defaultProps
    var protoModule = null;
    for( var mn in allModules[n] ){
        if( protoModule ) break;
        protoModule = allModules[n][mn].prototype;
    };
    function _setProps( m ){
        var constructorModule = m.constructor.__proto__; //m.constructor;
        if( !constructorModule._isComponentRoot ){
            _setProps( constructorModule.prototype );
        };
        if( constructorModule.defaultProps && _.isFunction( constructorModule.defaultProps ) ){
            var _dprops = constructorModule.defaultProps();
            _.extend( allConstructorProps, _dprops );
        };
    };
    _setProps( protoModule );

    allProps[n].propertys = _.extend( allConstructorProps, allProps[n].propertys );

    for( var mn in allModules[n] ){
        var module = allModules[n][mn];
        var moduleProps = module.defaultProps ? module.defaultProps() : {};

        //处理props上面所有的 _props 依赖 begin
        function setChildProps( p ){
            if( p._props ){
                var _propsIsArray = _.isArray( p._props );
                for( var k in p._props ){
                    
                    if( !_propsIsArray ){
                        p[ k ] = {
                            detail : k,
                            propertys : {}
                        };
                    };
                    
                    var _module = p._props[k];
                    if( _module.defaultProps ){

                        var _moduleProps = _module.defaultProps();

                        //先把ta原型上面的所有属性都添加到 _moduleProps 
                        var allConstructorProps={}
                        function _setProps( m ){
                            if( m.__proto__.__proto__ ){
                                _setProps( m.__proto__ );
                            };
                            if( m.defaultProps && _.isFunction( m.defaultProps ) ){
                                var _dprops = m.defaultProps();
                                if( _dprops._props ){
                                    //如果子元素还有 _props 依赖， 那么就继续处理
                                    setChildProps( _dprops );
                                };
                                _dprops && _.extend( allConstructorProps, _dprops );
                            };
                        };
                        _setProps( _module.__proto__ );
                        _moduleProps = _.extend( allConstructorProps, _moduleProps )

                        if( _propsIsArray ){
                            _.extend( p, _moduleProps );
                        } else {
                            p[k].propertys = _moduleProps;
                            setChildProps( p[k].propertys );
                        };

                        
                    };
                }
            }
        };
        setChildProps( moduleProps );
        //处理props上面所有的 _props 依赖 end

        //这里不能用下面的 extend 方法，
        moduleProps = _.extend( {}, allConstructorProps, moduleProps );

        //如果原型上面是有type 属性的，那么说明，自己是type分类路由的一个分支，放到typeMap下面
        if( allConstructorProps.type ){
            if( !allProps[n].typeMap ) allProps[n].typeMap = {};

            if( n == 'graphs' ){
                moduleProps.type.values = _graphNames;
                moduleProps.type.documentation = "可选的graphs类型有：\n" + _graphNames.join('\n');
            };

            allProps[n].typeMap[ mn ] = moduleProps;
            
        } else {
            _.extend( allProps[n].propertys, moduleProps );
        };  
    };
};
chartx.props = allProps;
//计算全量的 props 属性用来提供智能提示 begin

export default chartx;