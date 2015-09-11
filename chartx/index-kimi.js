window.Chartx || (Chartx = {
    _start  : function () {
        var __FILE__, scripts = document.getElementsByTagName("script");
        for( var i = scripts.length - 1; i>=0 ; i--  ){
            var __F__ = scripts[ i ].getAttribute("src");
            if( __F__.indexOf("chartx/index") >= 0 ){
                __FILE__ = __F__.substr(0 , __F__.indexOf("chartx/"));
                break;
            }
        };

        var furl = __FILE__.replace(/(^\s*)|(\s*$)/g, "").replace(/[^"]*(thx\/charts.+)/, "$1");

        var cmdDefine = define;
        var packages  = [{name:"canvax"} , {name:"chartx"}];
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
        window.define = function( id , deps , factory ){
            //只有固定的一些包是按照amd规范写的才需要转换。
            //比如canvax项目，是按照amd规范的，但是这个包是给业务项目中去使用的。
            //而这个业务使用seajs规范，所以业务中自己的本身的module肯定是按照seajs来编写的不需要转换

            if( typeof id == "string" && checkInBackages(id) ){
                //只有canvax包下面的才需要做转换，因为canvax的module是安装amd格式编写的
                //"thx/charts/1.9.21/"
                return cmdDefine(furl+id , deps , function( require, exports, module ){
                    var depList = [];
                    for( var i = 0 , l = deps.length ; i<l ; i++ ){
                        depList.push( require( furl+deps[i]) );
                    }
                    //return factory.apply(window , depList);

                    //其实用上面的直接return也是可以的
                    //但是为了遵循cmd的规范，还是给module的exports赋值
                    module.exports = factory.apply(window , depList);
                });
            } else {
            
                return cmdDefine.apply(window , arguments);
            }
        };

        Chartx._start = null;
        delete Chartx._start;
    }
});

Chartx._start && Chartx._start();
