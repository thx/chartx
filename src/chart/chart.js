import Canvax from "canvax2d"
import { getEl } from "../utils/tools"

const _ = Canvax._;

export default class Chart extends Canvax.Event.EventDispatcher
{
    constructor( node, data, opts )
    {

        super( node, data, opts );

        this.Canvax = Canvax;

        this.el = getEl(node) //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        this.width = parseInt(this.el.offsetWidth) //图表区域宽
        this.height = parseInt(this.el.offsetHeight) //图表区域高

        this.padding = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };

        //Canvax实例
		this.canvax = new Canvax.App({
		    el : this.el,
		    webGL : false
		});
		this.canvax.registEvent();
		this.stage = new Canvax.Display.Stage({
		    id: "main-chart-stage" + new Date().getTime()
		});
		this.canvax.addChild( this.stage );


        //组件管理机制
        this.plugs = [];

        this.inited = false;
        this.dataFrame = null; //每个图表的数据集合 都 存放在dataFrame中。

        this.init.apply(this, arguments);
        
        var me = this;
        if( opts.waterMark ){
            //添加水印的临时解决方案
            setTimeout( function(){
                me._initWaterMark( opts.waterMark );
            } , 50);
        }
    }

    init()
    {
    }

   
    draw()
    {
    }

    initData()
    {
    }

    /*
     * chart的销毁
     */
    destroy() 
    {
        this.clean();
        if(this.el){
            this.el.innerHTML = "";
            this.el = null;
        };
        this._destroy && this._destroy();
        this.fire("destroy");
    }

    /*
     * 清除整个图表
     **/
    clean()
    {
        for (var i=0,l=this.canvax.children.length;i<l;i++){
            var stage = this.canvax.getChildAt(i);
            for( var s = 0 , sl=stage.children.length ; s<sl ; s++){
                stage.getChildAt(s).destroy();
                s--;
                sl--;
            }
        };
    }

    /**
     * 容器的尺寸改变重新绘制
     */
    resize()
    {
        var _w = parseInt(this.el.offsetWidth);
        var _h = parseInt(this.el.offsetHeight);
        if( _w == this.width && _h == this.height ) return;
        this.clean();
        this.width = _w;
        this.height = _h;
        this.canvax.resize();
        this.inited = false;
        this.draw({
            resize : true
        });
        this.inited = true;
    }

    /**
     * reset有两种情况，一是data数据源改变， 一个options的参数配置改变。
     * @param obj {data , options}
     * 这个是最简单粗暴的reset方式，全部叉掉重新画，但是如果有些需要比较细腻的reset，比如
     * line，bar数据变化是在原有的原件上面做平滑的变动的话，需要在各自图表的构造函数中重置该函数
     */
    reset(obj)
    {
        this._reset && this._reset( obj );

        var d = ( this.dataFrame.org || [] );
        if (obj && obj.options) {
            _.extend(true, this, obj.options);
        };
        if (obj && obj.data) {
            d = obj.data;
        };

        //不放在上面的判断里，是因为options也可能会影响到 dataFrame，比如datazoom
        d && this.resetData(d);

        this.plugs = [];
        this.clean();
        this.canvax.domView.innerHTML = "";
        this.draw();
    }

    //这个resetData一般会被具体的chart实例给覆盖实现
    resetData( data )
    {
        this.dataFrame = this.initData( data );
    }

    _rotate(angle)
    {
        var currW = this.width;
        var currH = this.height;
        this.width = currH;
        this.height = currW;

        var self = this;
        _.each(self.stage.children, function(sprite) {
            sprite.context.rotation = angle || -90;
            sprite.context.x = (currW - currH) / 2;
            sprite.context.y = (currH - currW) / 2;
            sprite.context.rotateOrigin.x = self.width * sprite.context.$model.scaleX / 2;
            sprite.context.rotateOrigin.y = self.height * sprite.context.$model.scaleY / 2;
        });
    }

    //默认每个chart都要内部实现一个_initData
    _initData(data)
    {
        return data;
    }


    //插件管理相关代码begin
    initPlugsModules( opt )
    {

    }

    //所有plug触发更新
    plugsReset(opt , e)
    {

    }

    drawPlugs()
    {
        /*
        do {
            var p = this.plugs.shift();
            p && p.plug && p.plug.draw && p.plug.draw();
        } while ( this.plugs.length > 0 ); 
        */
        for( var i=0,l=this.plugs.length; i<l; i++ ){
            var p = this.plugs[i];
            p.plug && p.plug.draw && p.plug.draw();
            if( p.type == "once" ){
                this.plugs.splice( i, 1 );
                i--;
            }

            //p.plug.draw() 可能有新的plug被push进来
            l=this.plugs.length;
        }
    }

    //插件相关代码end

    //添加水印
    _initWaterMark( waterMarkOpt )
    {
        var text = waterMarkOpt.content || "waterMark";
        var sp = new Canvax.Display.Sprite({
            id : "watermark",
            context : {
                //rotation : 45,
                //rotateOrigin : {
                //    x : this.width/2,
                //    y : this.height/2
                //}
            }
        });
        var textEl = new Canvax.Display.Text( text , {
            context: {
                fontSize: waterMarkOpt.fontSize || 20,
                strokeStyle : waterMarkOpt.strokeStyle || "#ccc",
                lineWidth : waterMarkOpt.lineWidth || 2
            }
        });

        var textW = textEl.getTextWidth();
        var textH = textEl.getTextHeight();

        var rowCount = parseInt(this.height / (textH*5)) +1;
        var coluCount = parseInt(this.width / (textW*1.5)) +1;

        for( var r=0; r< rowCount; r++){
            for( var c=0; c< coluCount; c++){
                //TODO:text 的 clone有问题
                //var cloneText = textEl.clone();
                var _textEl = new Canvax.Display.Text( text , {
                    context: {
                        rotation : 45,
                        fontSize: waterMarkOpt.fontSize || 25,
                        strokeStyle : waterMarkOpt.strokeStyle || "#ccc",
                        lineWidth : waterMarkOpt.lineWidth || 0,
                        fillStyle : waterMarkOpt.fillStyle || "#ccc",
                        globalAlpha: waterMarkOpt.globalAlpha || 0.1
                    }
                });
                _textEl.context.x = textW*1.5*c + textW*.25;
                _textEl.context.y = textH*5*r ;
                sp.addChild( _textEl );
            }
        }

        this.stage.addChild( sp );
    }

}