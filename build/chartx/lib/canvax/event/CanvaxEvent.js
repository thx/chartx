/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */
define(
    "canvax/event/CanvaxEvent",
    [
         "canvax/core/Base"
    ],
    function(EventBase){
        var CanvaxEvent = function( e ) {
            this.target = null;
            this.currentTarget = null;	
            this.params = null;

            this.type   = e.type;
            this.points = null;

            this._stopPropagation = false ; //默认不阻止事件冒泡
        }
        CanvaxEvent.prototype = {
            stopPropagation : function() {
                this._stopPropagation = true;
            }
        }
        CanvaxEvent.pageX = function(e) {
            if (e.pageX) return e.pageX;
            else if (e.clientX)
                return e.clientX + (document.documentElement.scrollLeft ?
                        document.documentElement.scrollLeft : document.body.scrollLeft);
            else return null;
        }
        CanvaxEvent.pageY = function(e) {
            if (e.pageY) return e.pageY;
            else if (e.clientY)
                return e.clientY + (document.documentElement.scrollTop ?
                        document.documentElement.scrollTop : document.body.scrollTop);
            else return null;
        }
        return CanvaxEvent;
    } 
);
