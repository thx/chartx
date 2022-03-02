import Component from "../component"
import Canvax from "canvax"
import { getDefaultProps } from "../../utils/tools"

let AnimationFrame = Canvax.AnimationFrame;
let _ = Canvax._;

export default class GraphsBase extends Component
{
    static defaultProps(){
        return {
            type : {
                detail : '绘图组件',
                default       : "",
                insertText    : "type: ",
                values        : ["bar","line","pie","scat"] //具体的在index中批量设置，
            },
            animation : {
                detail : '是否开启入场动画',
                default: true
            },
            aniDuration: {
                detail: '动画时长',
                default: 600
            },
            color: {
                detail : 'line,area,node,label的抄底样式',
                default: 'left'
            }
        }
    }

    constructor(opt, app)
    {
        super( opt, app );
        //这里不能把opt个extend进this
        _.extend(true, this, getDefaultProps( GraphsBase.defaultProps() ));
        this.name = "graphs";

        //这里所有的opts都要透传给 group
        this._opt = opt || {};
        this.app = app;
        this.ctx = app.stage.ctx || app.stage.canvas.getContext("2d");
        this.dataFrame = app.dataFrame; //app.dataFrame的引用

        this.data   = null; //没个graphs中自己_trimGraphs的数据

        this.width  = 0;
        this.height = 0;
        this.origin = {
            x: 0,
            y: 0
        };

        this.inited = false;

        this.sprite = new Canvax.Display.Sprite({
            name: "graphs_"+opt.type
        });
        this.app.graphsSprite.addChild( this.sprite );

        this._growTween = null;
        let me = this;
        this.sprite.on("destroy" , function(){
            if(me._growTween){
                AnimationFrame.destroyTween( me._growTween );
                me._growTween = null;
            };
        });
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
    triggerEvent( e )
    {
        let trigger = e.eventInfo.trigger || this;
        let fn = trigger[ "on"+e.type ];
        if( fn && _.isFunction( fn ) ){
            //如果有在pie的配置上面注册对应的事件，则触发
            
            if( e.eventInfo && e.eventInfo.nodes && e.eventInfo.nodes.length ){
                //完整的nodes数据在e.eventInfo中有，但是添加第二个参数，如果nodes只有一个数据就返回单个，多个则数组
                if( e.eventInfo.nodes.length == 1 ){
                    fn.apply( this , [ e , e.eventInfo.nodes[0] ] );
                } else {
                    fn.apply( this , [ e , e.eventInfo.nodes ] );
                };
            } else {
                /*
                let _arr = [];
                _.each( arguments, function(item, i){
                    if( !!i ){
                        _arr.push( item );
                    }
                } );
                */
                fn.apply( this, arguments );
            }
            
        };
    }

    //所有graphs默认的grow
    grow( callback, opt ){
        !opt && (opt = {});
        let me = this; 
        let duration = this.aniDuration;
        if( !this.animation ){
            duration = 0;
        };
        let from = 0;
        let to = 1;
        if( "from" in opt ) from = opt.from;
        if( "to" in opt ) to = opt.to;
        
        this._growTween = AnimationFrame.registTween({
            from: {
                process: from
            },
            to: {
                process: to
            },
            duration: duration,
            onUpdate: function ( status ) {
                _.isFunction( callback ) && callback( status.process );
            },
            onComplete: function () {
                this._growTween = null;
                me.fire("complete");
            }
        });
    }

}