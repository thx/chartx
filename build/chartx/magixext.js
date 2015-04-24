define(
    "chartx/magixext", 
    [
        window.KISSY ? "magix/view" : "magix",
        window.KISSY ? "node" : null
    ],
    function(View){
        View=View.View||View;
        View.mixin({
            createChart : function(type , el , data , opts){
                var me  = this;
                var obj =  {
                    then : function(fn){
                        if( this.chart ){
                            _.isFunction( fn ) && fn( this.chart );
                            return this; 
                        };

                        this._promiseHand.push( fn );
                        return this;
                    },
                    chart : null,
                    _promiseHand : []
                };
                var query = window.KISSY ? KISSY.all : $;
                query = query("#"+this.id+" #" + el);
                me.manage( Chartx.create[ type ]( el , data , opts ).then(function( chart ){
                    obj.chart = chart;
                    _.each( obj._promiseHand , function( fn ){
                        _.isFunction( fn ) && fn( chart );
                    } );
                    obj._promiseHand = [];
                }) );

                return obj;

            }
        });
    }
);
