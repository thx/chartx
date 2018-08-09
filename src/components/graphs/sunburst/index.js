/*
* 太阳图
*/
import Canvax from "canvax"
import GraphsBase from "../index"

const _ = Canvax._;
const Text = Canvax.Display.Text;
const Sector = Canvax.Shapes.Sector;
const Circle = Canvax.Shapes.Circle;

export default class sunburstGraphs extends GraphsBase
{
    constructor(opt, root)
    {
        super( opt, root );

        this.type = "sunburst";

        this.field = null;

        //坚持一个数据节点的设置都在一个node下面
        this.node = {
            field : null, //node的id标识,而不是label

            strokeStyle: null,
            lineWidth : 1,
            lineAlpha : 1,
            fillStyle : null,
            fillAlpha : 1,

            focus : {
                enabled : true,
                lineAlpha : 1
            },
            select : {
                enabled : true,
                lineWidth : 1,
                strokeStyle : "#666"
            }
        };

        _.extend( true, this , opt );

        this.init( );
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "sunburst_graphs"
        });
    }
}