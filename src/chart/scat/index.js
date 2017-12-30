import Chart from "../descartes"
import Canvax from "canvax2d"

import Coordinate from "../../components/descartes/index"
import Graphs from "./graphs"
import Tips from "../../components/tips/index"

const _ = Canvax._;

export default class Scat extends Chart 
{
    constructor(node , data , opts)
    {
        super(node , data , opts)
        this.type = "scat";


        //坐标系统
        this.coordinate.xAxis.layoutType = "proportion";

        _.extend(true, this, opts);
        this.dataFrame = this.initData(data);

        this.draw();
    }

    draw( opt )
    {
        !opt && (opt ={});
        this.setStages();

        this._initModule( opt ); //初始化模块  
        this.initComponents( opt ); // 初始化组件
        this._startDraw( opt ); //开始绘图
        this.drawComponents( opt ); //开始绘制插件
        this.inited = true;
    }
    
    _initModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new Coordinate( this.coordinate, this );
        this.core.addChild( this._coordinate.sprite );

        this._graphs = new Graphs(this.graphs, this);
        this.core.addChild(this._graphs.sprite);

        this._tips = new Tips(this.tips, this.canvax.domView, this.dataFrame);
        this._tips._getDefaultContent = this._getTipDefaultContent;
        this.stageTip.addChild(this._tips.sprite);
    }

    _getTipDefaultContent( nodeInfo )
    {
        var res="";
        _.each( nodeInfo.nodesInfoList , function( nodeData ){
            res += (nodeData.xField+"："+ nodeData.value.x + "<br />")
            res += (nodeData.yField+"："+ nodeData.value.y)
        } );
        return res;
    }

    _startDraw(opt)
    {
        var me = this;

        this._coordinate.draw( opt );

        this._graphs.draw({
            x: this._coordinate.graphsX,
            y: this._coordinate.graphsY,
            w: this._coordinate.graphsWidth,
            h: this._coordinate.graphsHeight,
            inited: this.inited,
            resize: opt.resize
        }).on("complete" , function(){
            me.fire("complete");
        });

        this.bindEvent();
      
    }

    showLabel()
    {
        this._graphs._textsp.context.visible = true;
    }

    hideLabel()
    {
        this._graphs._textsp.context.visible = false;
    }

    bindEvent()
    {
        var me = this;
        this._graphs.sprite.on("panstart mouseover", function(e) {
            me._setXaxisYaxisToTipsInfo(e);
            me._tips.show(e);
            me.fire(e.type, e);
        });
        this._graphs.sprite.on("panmove mousemove", function(e) {
            me._setXaxisYaxisToTipsInfo(e);
            me._tips.move(e);
            me.fire(e.type, e);
        });
        this._graphs.sprite.on("panend mouseout", function(e) {
            me._tips.hide(e);
            me.fire(e.type, e);
        });
        this._graphs.sprite.on("tap click dblclick mousedown mouseup", function(e) {
            me._setXaxisYaxisToTipsInfo(e);
            me.fire(e.type, e);
        });
    }

    //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
    //方便外部自定义tip是的content
    _setXaxisYaxisToTipsInfo(e)
    {
        
        if (!e.eventInfo) {
            return;
        };

        var nodeData = e.eventInfo.nodesInfoList[0];

        if(nodeData){
            e.eventInfo.xAxis = {
                field : nodeData.xField,
                value : nodeData.value.x
            }
        }
        
    }



    //插件部分
    drawAnchor( _anchor )
    {

        /*
        var pos = {
            x : 0,
            y : 0
        };
        _anchor.aim( pos );
        */
        

    }
}
