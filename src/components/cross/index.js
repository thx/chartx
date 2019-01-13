import Component from "../component"
import Canvax from "canvax"
import { _, getDefaultProps } from "mmvis"

const Line = Canvax.Shapes.Line;

export default class Cross extends Component
{

    static defaultProps = {
        aimPoint : {
            detail : '准心位置',
            propertys : {
                x : {
                    detail : 'x',
                    default: 0
                },
                y : {
                    detail : 'y',
                    default: 0
                }
            }
        },
        line : {
            detail : '线配置',
            propertys : {
                strokeStyle : {
                    detail : '线颜色',
                    default: '#cccccc'
                },
                lineWidth: {
                    detail : '线宽',
                    default: 1
                },
                lineType: {
                    detail : '线样式类型',
                    default: 'solid'
                }
            }
        }
    }

    constructor(opt , app)
    {
        super(opt , app);

        this.name = "cross";

        this.width  = opt.width || 0;
        this.height = opt.height || 0;

        //x,y都是准心的 x轴方向和y方向的 value值，不是真实的px，需要
        this.x = null;
        this.y = null;
  
        this._hLine = null; //横向的线
        this._vLine = null; //竖向的线
       
        _.extend( true, this, getDefaultProps( Cross.defaultProps ), opt );

        this._yAxis = this.app.getComponent({name:'coord'})._yAxis[ this.yAxisAlign=="left"?0:1 ];
        this.sprite  = new Canvax.Display.Sprite();
        this.app.graphsSprite.addChild( this.sprite );
    }

    draw()
    {
        var me = this;

        var _coord = this.app.getComponent({name:'coord'});
        this.pos = {   
            x: _coord.origin.x,
            y: _coord.origin.y
        };
        this.width = _coord.width;
        this.height = _coord.height;
        this.aimPoint = {
            x : this.width / 2,
            y : this.height / 2
        };
        this.setPosition();


        me._hLine = new Line({ //横向线条
            context : {
                start : {
                    x : 0,
                    y : -this.aimPoint.y
                },
                end : {
                    x : me.width,
                    y : -this.aimPoint.y
                },
                strokeStyle : me.line.strokeStyle,
                lineWidth   : me.line.lineWidth,
                lineType    : me.line.lineType
            }
        });
        me.sprite.addChild( me._hLine );

        me._vLine = new Line({ //线条
            context : {
                start : {
                    x : this.aimPoint.x,
                    y : 0
                },
                end : {
                    x : this.aimPoint.x,
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