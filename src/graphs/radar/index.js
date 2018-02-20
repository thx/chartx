import Canvax from "canvax2d"
import Theme from "../../theme"

const Polygon = Canvax.Shapes.Polygon;
const _ = Canvax._;

export default class RadarGraphs extends Canvax.Event.EventDispatcher
{
    constructor(opts, root)
    {
        super( opts, root );

        this.type = "radar";

        //这里所有的opts都要透传给 group
        this._opts = opts || {};
        this.root = root;
        this.ctx = root.stage.context2D;
        
        this.data = []; //二维 [[{x:0,y:-100,...},{}],[]] ,所有的grapsh里面的data都存储的是layout数据
        this.groupsData = []; //节点分组 { groupName: '', list: [] } 对上面数据的分组

        this.width = 0;
        this.height = 0;
        this.origin = {
            x: 0,
            y: 0
        };

        this.animation = true;

        this.field = null;

        this.colors  = Theme.colors;

        this.sprite   = null;

        _.extend( true, this , opts );

        this.init( );
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "graphsEl"
        });
    }

    draw(opts)
    {
        debugger
    }

}
