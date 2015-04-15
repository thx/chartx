define("chartx/magixext" , [window.KISSY ? "magix/view" : "magix"] , function(View){
    View=View.View||View;
    View.mixin({
        createChart : function(type , el , data , opts){
            var me  = this;
            var obj =  {
                then : function(fn){
                    this._promiseHand = fn;
                },
                _promiseHand : null
            };
            me.manage( Chartx.create[ type ]( el , data , opts ).then(function( chart ){
                setTimeout(function(){
                    _.isFunction( obj._promiseHand ) && obj._promiseHand( chart );
                } , 2);
            }) );

            return obj;

        }
    });
});
