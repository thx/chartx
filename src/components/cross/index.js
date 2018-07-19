import Component from "../component"
import Canvax from "canvax"

const Line = Canvax.Shapes.Line;
const Sprite = Canvax.Display.Sprite;
const Text = Canvax.Display.Text;
const _ = Canvax._;

export default class MarkLine extends Component
{
    constructor(opt , _yAxis)
    {
        super(opt , _yAxis);

        this._yAxis = _yAxis;

        this.width  = opt.width || 0;
        this.height = opt.height || 0;

        //x,y都是准心的 x轴方向和y方向的 value值，不是真实的px，需要
        this.x = null,
        this.y = null
        
        //准心的位置
        this.aimPoint = {
            x : this.width / 2,
            y : this.height / 2
        };
       
        //圆点，对应着坐标系统的原点
        this.origin = {
            x : 0 , y : 0
        };

        this.line       = {
            y           : 0,
            strokeStyle : '#cccccc',
            lineWidth   : 1,
            smooth      : false,
            lineType    : 'solid'
        };

        this.node = {
            enabled : false,
            shapeType : "circle",
            r : 1,
            fillStyle : "#999"
        };

        this.label = {
            enabled  : false,
            fillStyle: '#999999',
            fontSize : 12,
            value  : null,
            lineType : 'dashed',
            lineWidth: 1,
            strokeStyle : "white"
        };

        this._txt   = null;
        this._node  = null;
        this._hLine = null; //横向的线
        this._vLine = null; //竖向的线
       
        opt && _.extend(true, this, opt);

        this.init();
    }

    init()
    {
        this.sprite  = new Sprite({
            id : "cross_"+Canvax.utils.getUID(),
            context : {
                x : this.origin.x,
                y : this.origin.y
            }
        });
    }

    draw()
    {
        var me = this;
        var aimPoint = me.aimPoint;

        me._hLine = new Line({//横向线条
            context : {
                start : {
                    x : 0,
                    y : -aimPoint.y
                },
                end : {
                    x : me.width,
                    y : -aimPoint.y
                },
                strokeStyle : me.line.strokeStyle,
                lineWidth   : me.line.lineWidth,
                lineType    : me.line.lineType
            }
        });
        me.sprite.addChild( me._hLine );


        me._vLine = new Line({               //线条
            context : {
                start : {
                    x : aimPoint.x,
                    y : 0
                },
                end : {
                    x : aimPoint.x,
                    y : -me.height
                },
                strokeStyle : me.line.strokeStyle,
                lineWidth   : me.line.lineWidth,
                lineType    : me.line.lineType
            }
        });
        me.sprite.addChild( me._vLine );

    }

}