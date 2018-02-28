import Canvax from "canvax2d"

const _ = Canvax._;

export default class GraphsBase extends Canvax.Event.EventDispatcher
{
    constructor(opts, root)
    {
        super( opts, root );

        //这里所有的opts都要透传给 group
        this._opts = opts || {};
        this.root = root;
        this.ctx = root.stage.canvas.getContext("2d");
        this.dataFrame = root.dataFrame; //root.dataFrame的引用

        this.data = null; //{ ur : [] , pv : [] } 平铺hash结构
        this.field = null;
        this.sprite   = null;

        this.width = 0;
        this.height = 0;
        this.origin = {
            x: 0,
            y: 0
        };

        this.animation = true;
    }

    tipsPointerOf(e){}

    tipsPointerHideOf(e){}

    focusAt( ind, field ){}
    
    unfocusAt( ind, field ){}
    
    selectAt( ind, field ){}

    unselectAt( ind, field ){}

    remove( field ){}

    add( field ){}

    getLegendData(){}

    //触发事件, 事件处理函数中的this都指向对应的graphs对象。
    triggerEvent( eventTargetOpt, e )
    {
        var fn = eventTargetOpt[ "on"+e.type ];
        if( fn && _.isFunction( fn ) ){
            //如果有在pie的配置上面注册对应的事件，则触发
            var nodeData = null;
            if( e.eventInfo && e.eventInfo.nodes && e.eventInfo.nodes.length ){
                nodeData = e.eventInfo.nodes[0];
            };
            fn.apply( this , [ e , nodeData ] );
        };
    }

}