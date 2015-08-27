define(
    "chartx/components/markline/index",
    [
         "canvax/index",
         "canvax/shape/BrokenLine",
    ],
    function(Canvax, BrokenLine){
        var markLine = function(opt){

            this.origin      = {
                x : 0 , y : 0
            };

            this.line       = {
                y           : 0,
                list        : [],
                strokeStyle : '#000000',
                lineWidth   : 1,
                smooth      : false,
                lineType    : 'dashed'
            };

            this._doneHandle = null;
            this.done   = function( fn ){
                this._doneHandle = fn;
            };

            opt && _.deepExtend(this, opt);

            this.init();
        }
        markLine.prototype = {
            init : function(){
                var me = this;
                this.sprite  = new Canvax.Display.Sprite({ 
                    context : {
                        x : this.origin.x,
                        y : this.origin.y
                    }
                });

                setTimeout( function(){
                    me.widget();
                } , 10 );
            },
            widget : function(){
                var me = this
                var line = new BrokenLine({               //线条
                    id : "line",
                    context : {
                        y           : me.line.y,
                        pointList   : me.line.list,
                        strokeStyle : me.line.strokeStyle,
                        lineWidth   : me.line.lineWidth,
                        lineType    : me.line.lineType
                    }
                });
                me.sprite.addChild(line)
                me._done();
            },
            _done : function(){
                _.isFunction( this._doneHandle ) && this._doneHandle.apply( this , [] );
            },
        }
        return markLine
    } 
);
