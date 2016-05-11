define(
    "chartx/magixext", 
    [
        window.KISSY ? "magix/view" : "magix",
        window.KISSY ? "node" : null
    ],
    function( View ){
        View=View.View||View;
        View.prototype.createChart = function( opt ){

            var type , el , data , opts ;

            var _ = window._ || KISSY;

            var args = arguments;
            if( args.length > 1 && !_.isObject(args[0]) ){
                type = args[0];
                el   = args[1];
                data = args[2];
                opts = args[3];
            } else {
                type = opt.type;
                el   = opt.el;
                data = opt.data; 
                opts = opt.opts;
            };

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
            el = el.replace(/(^\s*)|(\s*$)/g, "");
            if( el.slice(0,1)!= "#" && el.slice(0,1)!="." ){
                el = "#"+el;
            };
            query = query("#"+this.id+" " + el);
            me.manage( el , Chartx.create[ type ]( query , data , opts ).then(function( chart ){
                obj.chart = chart;
                _.each( obj._promiseHand , function( fn ){
                    _.isFunction( fn ) && fn( chart );
                } );
                obj._promiseHand = [];
            }) );

            return obj;

        }
        
    }
);
