window.Chartx || (Chartx = {
    _charts: ['bar', 'force', 'line', 'map', 'pie', 'planet', 'progress', 'radar', 'scat', 'topo', 'chord', 'venn', 'hybrid', 'funnel', 'cloud' , 'original' , 'sankey'],
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
        var promise = {
            _thenFn: [],
            then: function(fn) {
                if (this.chart) {
                    _.isFunction(fn) && fn(this.chart);
                    return this;
                }
                this._thenFn.push(fn);
                return this;
            },
            _destroy: false,
            chart: null,
            destroy: function() {
                //console.log("chart destroy!");
                this._destroy = true;
                if (this.chart) {
                    //this.chart.destroy();
                    delete this.chart;
                    promise = null;
                }
            },
            path: null
        };


        var path = "chartx/chart/" + name + "/" + (options.type ? options.type : "index");
        var getChart = function() {
            require([path], function(chartConstructor) {
                if (!promise._destroy) {

                    promise.chart = new chartConstructor(el, data, options);
                    promise.chart.draw();

                    function _drawEnd(){
                        _.each(promise._thenFn, function(fn) {
                            _.isFunction(fn) && fn(promise.chart);
                        });
                        promise._thenFn = [];
                        promise.path = path;
                    };

                    if( promise.chart._drawEnd ){
                        promise.chart._drawEnd( _drawEnd );
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
                //BEGIN(develop)
                //下面这段代码只会在开发环境存在，解决seajs配置包路径中是相对路径的bug
                if (!window.location.origin) {
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                };
                if (path.indexOf("../") >= 0) {
                    var si = path.split("../").length;
                    var pathUrl = window.location.origin + window.location.pathname.split("/").slice(0, -si).join("/") + "/chartx"
                    if (name == "canvax") {
                        pathUrl += "/lib/canvax"
                    }
                    packageObj[name] = pathUrl;
                };
                //END(develop)
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