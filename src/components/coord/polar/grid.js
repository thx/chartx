import Canvax from "canvax"
import {getDefaultProps} from "../../../utils/tools"

let { _, event } = Canvax
const Line = Canvax.Shapes.Line;
const Circle = Canvax.Shapes.Circle;
const Polygon = Canvax.Shapes.Polygon;

export default class polarGrid extends event.Dispatcher
{
    static defaultProps(){
        return {
            enabled : {
                detail : '是否开启grid',
                default: false
            },
            ring : {
                detail : '环背景线',
                propertys : {
                    shapeType: {
                        detail : '线的图形样式，默认poly，可选circle',
                        default: 'poly'
                    },
                    lineType:{
                        detail : '线条样式，sold实线，dashed虚线',
                        default: 'sold'
                    },
                    lineWidth: {
                        detail : '线宽',
                        default: 1
                    },
                    strokeStyle: {
                        detail : '线颜色',
                        default : '#e5e5e5'
                    },
                    fillStyle : {
                        detail : '环填充色,支持函数配置',
                        default: null
                    },
                    fillAlpha : {
                        detail : '环填充的透明度',
                        default: 0.5
                    }
                }
            },
            ray : {
                detail : '射线',
                propertys: {
                    enabled : {
                        detail : '是否开启',
                        default: true
                    },
                    lineWidth  : {
                        detail : '线宽',
                        default: 1
                    },
                    strokeStyle : {
                        detail  : '线颜色',
                        default : '#e5e5e5'
                    }
                }
            }
        }
    }

    constructor( opt, app )
    {
        super( opt, app);

        this.width   = 0;   
        this.height  = 0;
        this.app    = app; //该组件被添加到的目标图表项目，

        this.pos     = {
            x : 0,
            y : 0
        };

        this.dataSection = [];
    
        this.sprite = null;//总的sprite

        this.induce = null; //最外层的那个网，用来触发事件

        _.extend( true, this, getDefaultProps( polarGrid.defaultProps() ), opt );

        this.init(opt);
    }

    init()
    { 
        this.sprite = new Canvax.Display.Sprite();
    }

    setX($n)
    {
        this.sprite.context.x = $n
    }

    setY($n)
    {
        this.sprite.context.y = $n
    }

    draw(opt)
    {
        _.extend(true, this , opt );
        
        this._widget();

        this.setX(this.pos.x);
        this.setY(this.pos.y);
    }

    clean()
    {
        this.sprite.removeAllChildren();
    }

    reset( opt )
    {    
        /*
        this.sprite.removeAllChildren();
        this.draw( opt );
        */
    }

    _widget()
    {
        
        let me = this;
        _.each( this.dataSection, function( num, i ){

            if( num ) {
                
                let r = me.app.getROfNum( num );
                let points = me.app.getPointsOfR( r );

                let ctx = {
                    //lineType : me.ring.lineType,
                    lineWidth : me.ring.lineWidth,
                    strokeStyle : me._getStyle( me.ring.strokeStyle , i-1 ),//me.ring.strokeStyle,
                    fillStyle : me._getStyle( me.ring.fillStyle , i-1 ),
                    fillAlpha : me.ring.fillAlpha
                };

                let _ring;
                let ringType = Circle;
                if( me.ring.shapeType == "circle" ){
                    ctx.r = r;
                    _ring = new ringType({
                        context : ctx
                    });
                } else {
                    ctx.pointList = [];
                    _.each( points, function( point , i ){
                        if( i < points.length ){
                            ctx.pointList.push( [ point.x, point.y ] );
                        }
                    } );
                    ringType = Polygon;
                    _ring = new ringType({
                        context : ctx
                    });
                };
                me.sprite.addChildAt( _ring , 0 );

                if( i == me.dataSection.length-1 ){
                    ctx.fillAlpha = 0;
                    ctx.fillStyle = "#ffffff";
                    me.induce = new ringType({
                        context : ctx
                    });
                    me.sprite.addChild( me.induce );
                };

                //绘制中心出发的蜘蛛网线
                let aAxisLayoutData = [];
                
                _.each( points, function( point ){
                    let _line = new Line({
                        context : {
                            end : point,
                            lineWidth : me.ring.lineWidth,
                            strokeStyle : me.ring.strokeStyle
                        }
                    });
                    me.sprite.addChild( _line );
                } );
            }
        } );
    }

    _getStyle( color , i )
    {
        if( _.isArray(color) ){
            return color[ i%color.length ]
        }
        return color;
    }
}