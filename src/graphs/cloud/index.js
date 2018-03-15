import Canvax from "canvax2d"
import GraphsBase from "../index"

const Circle = Canvax.Shapes.Circle;
const Rect = Canvax.Shapes.Rect;
const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class ScatGraphs extends GraphsBase
{
    constructor(opts, root)
    {
        super( opts, root );

        this.type = "cloud";

        this.node = {
            shapeType : "text", //节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现
            fontColor : "#ccc",
            fontSize  : 18,
            focus : {
                enabled : true,
                lineWidth : 6,
                lineAlpha : 0.2,
                fillAlpha : 0.8
            },
            select : {
                enabled : true,
                lineWidth : 8,
                lineAlpha : 0.4,
                fillAlpha : 1
            }
        };

        _.extend( true, this , opts );

        this.init( );
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "graphsEl"
        });
    }

    draw()
    {
        debugger
    }

}
