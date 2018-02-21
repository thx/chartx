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
debugger
        //这里所有的opts都要透传给 group
        this._opts = opts || {};
        this.root = root;
        this.ctx = root.stage.canvas.getContext("2d");
        
        this.data = []; //二维 [[{x:0,y:-100,...},{}],[]] ,所有的grapsh里面的data都存储的是layout数据
        this.enabledField = null;

        this.width = 0;
        this.height = 0;
        this.origin = {
            x: 0,
            y: 0
        };

        this.animation = true;

        this.field = null;

        this.sprite   = null;

        _.extend( true, this , opts );

        this.init();
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "graphsEl"
        });
    }

    draw(opts)
    {
        _.extend(true, this, opts);
        
        var me = this;

        this.data = this._trimGraphs();
    }

    setEnabledField()
    {
        //要根据自己的 field，从enabledFields中根据enabled数据，计算一个 enabled版本的field子集
        this.enabledField = this.root._coordinate.getEnabledFields( this.field );
    }

    _trimGraphs()
    {
        var me = this;
        var _coor = this.root._coordinate;

        //用来计算下面的hLen
        this.setEnabledField();
        debugger
    }

}
