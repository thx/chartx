import Canvax from "canvax2d"
import GraphsBase from "../index"
import cloudLayout from "../../layout/cloud"

const _ = Canvax._;
const Text = Canvax.Display.Text;

export default class CloudGraphs extends GraphsBase
{
    constructor(opts, root)
    {
        super( opts, root );

        this.type = "cloud";

        this.field = null;

        this.maxVal = 0;
        this.minVal = 0;

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
            id : "graphsEl"
        });
    }

    draw( opts )
    {
        !opts && (opts ={});
        _.extend( true, this , opts );
        this._drawGraphs();
        this.sprite.context.x = this.width / 2;
        this.sprite.context.y = this.height / 2;

        this.fire("complete");
    }


}
