import Canvax from "canvax2d"
import GraphsBase from "../index"

const _ = Canvax._;
const Text = Canvax.Display.Text;
const Polygon = Canvax.Shapes.Polygon;

export default class FunnelGraphs extends GraphsBase
{
    constructor(opts, root)
    {
        super( opts, root );

        this.type = "funnel";

        this.field = null;

        this.data  = []; //layoutData list , default is empty Array

        this.maxVal = null;
        this.minVal = null;
        this.maxWidth = null;
        this.minWidth = 0;

        this.node = {
            shapeType   : "polygon", //节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现

            focus : {
                enabled : true
            },
            select : {
                enabled : true,
                lineWidth : 2,
                strokeStyle : "#666"
            }
        };

        _.extend( true, this , opts );

        this.init( );
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            name : "funnelGraphsEl"
        });
    }

    draw( opts )
    {
        !opts && (opts ={});
        
        //第二个data参数去掉，直接trimgraphs获取最新的data
        _.extend(true, this, opts);

        var me = this;

        var animate = me.animation && !opts.resize;

        this.data = this._trimGraphs();
    }

    _trimGraphs()
    {
        if( !this.field ) return;
        debugger
        var _org = this.dataFrame.getFieldData( this.field );

    }

    _drawGraphs()
    {

    }


}
