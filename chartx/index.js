var Chartx = {
    _charts : ['bar' , 'force' , 'line' , 'map' , 'pie' , 'planet' , 'progress' , 'radar' , 'scat' , 'topo'],
    create  : {},
    start   : function () {
        //业务代码部分。
        //如果charts有被down下来使用。请修改下面的 

        var canvaxVersion = "2015.05.20";

        //BEGIN(develop)
        if ((/daily.taobao.net/g).test(location.host)) {
            Chartx.site.daily = true;
        }
        //END(develop)

        
        
        var __FILE__, scripts = document.getElementsByTagName("script"); 
        __FILE__ = scripts[scripts.length - 1].getAttribute("src");
        __FILE__ = __FILE__.substr(0 , __FILE__.indexOf("chartx/"));
        
        Chartx.path = __FILE__.replace(/(^\s*)|(\s*$)/g, "");

        if( (/daily.taobao.net/g).test( __FILE__ ) ){
            Chartx.site.daily = true;
        }

        //配置canvax包
        var canvaxUrl     = "http://g.tbcdn.cn/thx/canvax/"+ canvaxVersion +"/";
        
        if( Chartx.site.daily || Chartx.site.local ){
            canvaxUrl     = "http://g.assets.daily.taobao.net/thx/canvax/"+ canvaxVersion +"/";
        }
        //BEGIN(develop)
        //下面这个是canvax开发者专用，因为我会在本地跑一个canvax，可以canvax和chartx实时调试
        if( !! ~location.search.indexOf('localcanvax') ){
            //本地环境测试
            canvaxUrl     = "http://nick.daily.taobao.net/canvax/";
        }
        //END(develop)


        Chartx.setPackages([{
            name: 'canvax',
            path: canvaxUrl
        }, {
            name: 'chartx',
            path: Chartx.path
        }]

        );

        //然后就可以Chartx.create.line("el" , data , options).then( function( chart ){  } ) 的方式接入图表
        for(var a = 0,l = Chartx._charts.length ; a < l ; a++){
            Chartx.create[ Chartx._charts[a] ] = (function( ctype ){
                return function(el , data , options){
                    return Chartx._queryChart(ctype , el , data , options);
                }
            })(Chartx._charts[a]);
        };
    },
    _queryChart : function(name , el , data , options){
        var promise = {
            _thenFn : [],
            then : function( fn ){
                if( this.chart ){
                    _.isFunction( fn ) && fn( this.chart );
                    return this; 
                }
                this._thenFn.push( fn );
                return this;
            },
            _destory : false,
            chart    : null,
            destroy  : function(){
                console.log("chart destroy!");
                this._destory = true;
                this.chart.destroy();
                delete this.chart;
                promise = null;
            },
            path     : null
        };


        var path = "chartx/chart/"+name+"/"+( options.type ? options.type : "index" );
        require( [ path ] , function( chartConstructor ){
            if( !promise._destory ){
                promise.chart = new chartConstructor(el , data , options);
                _.each(promise._thenFn , function( fn ){
                    _.isFunction( fn ) && fn( promise.chart );
                });
                promise._thenFn = [];
                //在then处理函数执行了后自动draw
                promise.chart.draw();
            }
        } );

        return promise;

    },
    site: {
        local: !! ~location.search.indexOf('local'),
        daily: !! ~location.search.indexOf('daily'),
        debug: !! ~location.search.indexOf('debug'),
        build: !! ~location.search.indexOf('build')
    },
    /**
     *@packages array [{name:,path:}]
     */
    setPackages: function (packages) {
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
        }

        function isArray(obj){
            return (obj.constructor.toString().indexOf("Array") != -1)
        }

        if (!window.define) {
            if(KISSY){
                window.define = function define(id, dependencies, factory) {
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

                if(!window.require){
                    window.require = function( deps , hander ){
                        function proxy() {
                            var args = [].slice.call(arguments, 1, arguments.length);
                            return hander.apply(window, args)
                        }
                        KISSY.use( isArray(deps) ? deps.join(",") : deps , proxy );
                    };
                }
            }
        } 
        if( typeof define == "function" && define.cmd ){
            var cmdDefine = define;
            window.define = function( id , deps , factory ){

                //只有固定的一些包是按照amd规范写的才需要转换。
                //比如canvax项目，是按照amd规范的，但是这个包是给业务项目中去使用的。
                //而这个业务使用seajs规范，所以业务中自己的本身的module肯定是按照seajs来编写的不需要转换
                
                if( typeof id == "string" && checkInBackages(id) ){
                    //只有canvax包下面的才需要做转换，因为canvax的module是安装amd格式编写的
                    return cmdDefine(id , deps , function( require, exports, module ){
                        var depList = [];
                        for( var i = 0 , l = deps.length ; i<l ; i++ ){
                            depList.push( require(deps[i]) );
                        }
                        //return factory.apply(window , depList);

                        //其实用上面的直接return也是可以的
                        //但是为了遵循cmd的规范，还是给module的exports赋值
                        module.exports = factory.apply(window , depList);
                    });
                } else {
                    return cmdDefine.apply(window , arguments);
                }
            }
            if( !window.require ){
                window.require = seajs.use;
            }
        }    
        if( typeof define == "function" && define.amd ){
            //额，本来就是按照amd规范来开发的，就不需要改造了。
        }

        for (var i = 0, l = packages.length; i < l; i++) {
            var name = packages[i].name.toString();
            var path = packages[i].path;
            window.KISSY && KISSY.config({ packages: [{
                name: name,
                path: path,
                debug: Chartx.site.debug,
                combine: !Chartx.site.local
            }]
            });

            var packageObj = {};
            packageObj[name] = path;
            if (window.seajs) {
                packageObj[name] = path + name;
                //BEGIN(develop)
                if( path == "../../" && name == "chartx" ){
                    packageObj[name] = window.location.origin+window.location.pathname.split("/").slice(0 , -3).join("/")+"/chartx"
                }
                //END(develop)
                seajs.config({ paths: packageObj });
            }
            if (window.requirejs) {
                packageObj[name] = path + name;
                requirejs.config({ paths: packageObj });
            }
        }
    },
    // dom操作相关代码
    getEl: function (el) {
        if (_.isString(el)) {
            return document.getElementById(el);
        }
        if (el.nodeType == 1) {
            //则为一个element本身
            return el;
        }
        if (el.length) {
            return el[0];
        }
        return null;
    },
    getOffset: function (el) {
        var box = el.getBoundingClientRect(),
        doc     = el.ownerDocument,
        body    = doc.body,
        docElem = doc.documentElement,

        // for ie  
        clientTop  = docElem.clientTop || body.clientTop || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,

        // In Internet Explorer 7 getBoundingClientRect property is treated as physical, 
        // while others are logical. Make all logical, like in IE8. 

        zoom = 1;
        if (body.getBoundingClientRect) {
            var bound = body.getBoundingClientRect();
            zoom = (bound.right - bound.left) / body.clientWidth;
        }
        if (zoom > 1) {
            clientTop = 0;
            clientLeft = 0;
        }
        var top = box.top / zoom + (window.pageYOffset || docElem && docElem.scrollTop / zoom || body.scrollTop / zoom) - clientTop,
            left = box.left / zoom + (window.pageXOffset || docElem && docElem.scrollLeft / zoom || body.scrollLeft / zoom) - clientLeft;

        return {
            top: top,
                left: left
        };
    }
};

Chartx.start();
