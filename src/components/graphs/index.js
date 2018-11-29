import Component from "../component"
import { _ } from "mmvis"

export default class GraphsBase extends Component
{
    constructor(opt, app)
    {
        super( opt, app );

        this.name = "graphs";

        //这里所有的opts都要透传给 group
        this._opt = opt || {};
        this.app = app;
        this.ctx = app.stage.canvas.getContext("2d");
        this.dataFrame = app.dataFrame; //app.dataFrame的引用

        this.data   = null; //没个graphs中自己_trimGraphs的数据
        
        this.sprite = null;

        this.width  = 0;
        this.height = 0;
        this.origin = {
            x: 0,
            y: 0
        };

        this.animation = true;
        this.inited = false;
    }

    tipsPointerOf(e){}

    tipsPointerHideOf(e){}

    focusAt( ind, field ){}
    
    unfocusAt( ind, field ){}
    

    selectAt( ind, field ){}
    unselectAt( ind, field ){}
    //获取选中的 数据点
    getSelectedList(){ return [] }
    //获取选中的 列数据, 比如柱状图中的多分组，选中一列数据，则包函了这分组内的所有柱子
    getSelectedRowList(){ return [] }

    hide( field ){}

    show( field ){}

    getLegendData(){}

    //触发事件, 事件处理函数中的this都指向对应的graphs对象。
    triggerEvent( eventTargetOpt, e )
    {
        var fn = eventTargetOpt[ "on"+e.type ];
        if( fn && _.isFunction( fn ) ){
            //如果有在pie的配置上面注册对应的事件，则触发
            var nodeData = null;
            if( e.eventInfo && e.eventInfo.nodes && e.eventInfo.nodes.length ){
                if( e.eventInfo.nodes.length == 1 ){
                    fn.apply( this , [ e , e.eventInfo.nodes[0] ] );
                } else {
                    fn.apply( this , [ e , e.eventInfo.nodes ] );
                }
            } else {
                var _arr = [];
                _.each( arguments, function(item, i){
                    if( !!i ){
                        _arr.push( item );
                    }
                } );
                fn.apply( this, _arr );
            }
            
        };
    }

}