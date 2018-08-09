/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 */
define(
    "canvax/event/EventHandler", [
        "canvax/core/Base", 
        ('ontouchstart' in window) ? "canvax/event/handler/touch" : "canvax/event/handler/mouse",
        "canvax/display/Point",
        "canvax/event/CanvaxEvent"
    ],
    function(Base, Handler, Point, CanvaxEvent) {
        var EventHandler = function(canvax) {
            this.canvax = canvax;
            this.curPoints = [new Point(0, 0)] //X,Y 的 point 集合, 在touch下面则为 touch的集合，只是这个touch被添加了对应的x，y

            //当前激活的点对应的obj，在touch下可以是个数组,和上面的curPoints对应
            this.curPointsTarget = [];

            this._touching = false;
            //正在拖动，前提是_touching=true
            this._draging = false;

            //当前的鼠标状态
            this._cursor = "default";
        };
        Base.creatClass(EventHandler, Handler, {
            /*
             *@param {array} childs 
             * */
            __dispatchEventInChilds: function(e, childs) {
                if (!childs && !("length" in childs)) {
                    return false;
                }
                var me = this;
                var hasChild = false;
                _.each(childs, function(child, i) {
                    if (child) {
                        hasChild = true;
                        var ce = new CanvaxEvent(e);
                        ce.target = ce.currentTarget = child || this;
                        ce.stagePoint = me.curPoints[i];
                        ce.point = ce.target.globalToLocal(ce.stagePoint);
                        child.dispatchEvent(ce);
                    }
                });
                return hasChild;
            },
            //克隆一个元素到hover stage中去
            _clone2hoverStage: function(target, i) {
                var me = this;
                var root = me.canvax;
                var _dragDuplicate = root._hoverStage.getChildById(target.id);
                if (!_dragDuplicate) {
                    _dragDuplicate = target.clone(true);
                    _dragDuplicate._transform = target.getConcatenatedMatrix();

                    /**
                     *TODO: 因为后续可能会有手动添加的 元素到_hoverStage 里面来
                     *比如tips
                     *这类手动添加进来的肯定是因为需要显示在最外层的。在hover元素之上。
                     *所有自动添加的hover元素都默认添加在_hoverStage的最底层
                     **/

                    root._hoverStage.addChildAt(_dragDuplicate, 0);
                }
                _dragDuplicate.context.globalAlpha = target._globalAlpha;
                _dragDuplicate._dragPoint = target.globalToLocal(me.curPoints[i]);
                return _dragDuplicate;
            },
            //drag 中 的处理函数
            _dragHander: function(e, target, i) {
                var me = this;
                var root = me.canvax;
                var _dragDuplicate = root._hoverStage.getChildById(target.id);
                var gPoint = new Point(me.curPoints[i].x - _dragDuplicate._dragPoint.x, me.curPoints[i].y - _dragDuplicate._dragPoint.y);
                _dragDuplicate.context.x = gPoint.x;
                _dragDuplicate.context.y = gPoint.y;
                target.drag && target.drag(e);

                //要对应的修改本尊的位置，但是要告诉引擎不要watch这个时候的变化
                var tPoint = gPoint;
                if (target.type != "stage" && target.parent && target.parent.type != "stage") {
                    tPoint = target.parent.globalToLocal(gPoint);
                }
                target._notWatch = true;
                target.context.x = tPoint.x;
                target.context.y = tPoint.y;
                target._notWatch = false;
                //同步完毕本尊的位置
            },
            //drag结束的处理函数
            _dragEnd: function(e, target, i) {
                var me = this;
                var root = me.canvax;

                //_dragDuplicate 复制在_hoverStage 中的副本
                var _dragDuplicate = root._hoverStage.getChildById(target.id);
                _dragDuplicate.destroy();

                target.context.globalAlpha = target._globalAlpha;
            },
            _stopBubble: function(e) {
                //如果提供了事件对象，则这是一个非IE浏览器
                if (e && e.stopPropagation)
                //因此它支持W3C的stopPropagation()方法
                    e.stopPropagation();
                else
                //否则，我们需要使用IE的方式来取消事件冒泡
                    window.event.cancelBubble = true;
            },
            //阻止浏览器的默认行为
            _stopDefault: function(e) {
                //阻止默认浏览器动作(W3C)
                if (e && e.preventDefault)
                    e.preventDefault();
                //IE中阻止函数器默认动作的方式
                else
                    window.event.returnValue = false;
                return false;
            }
        });
        return EventHandler;
    }
);