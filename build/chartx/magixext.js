define("chartx/magixext" , [window.KISSY ? "magix/view" : "magix"] , function(View){
    View=View.View||View;
    View.mixin({
        createChart : function(type , el , data , opts){
            var me = this;
            return {
                then : function(fn){
                    me.manage( Chartx.create[ type ]( el , data , opts ).then(function( chart ){
                        _.isFunction(fn) && fn(chart);
                    }) );
                }
            };
        }
    });
});

