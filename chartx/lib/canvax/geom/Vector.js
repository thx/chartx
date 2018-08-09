
/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 向量操作类
 * */
define(
    "canvax/geom/Vector",
    [],
    function(){
        function Vector(x, y) {
            var vx = 0,vy = 0;
            if ( arguments.length == 1 && _.isObject( x ) ){
                var arg = arguments[0];
                if( _.isArray( arg ) ){
                   vx = arg[0];
                   vy = arg[1];
                } else if( arg.hasOwnProperty("x") && arg.hasOwnProperty("y") ) {
                   vx = arg.x;
                   vy = arg.y;
                }
            }
            this._axes = [vx, vy];
        };
        Vector.prototype = {
            distance: function (v) {
                var x = this._axes[0] - v._axes[0];
                var y = this._axes[1] - v._axes[1];
    
                return Math.sqrt((x * x) + (y * y));
            }
        };
        return Vector;
    } 
)
