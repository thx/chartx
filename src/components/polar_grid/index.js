import Component from "../component"
import Canvax from "canvax2d"

const Line = Canvax.Shapes.Line;
const Circle = Canvax.Shapes.Circle;
const Polygon = Canvax.Shapes.Polygon;

const _ = Canvax._;

export default class polarGrid extends Component
{
    constructor( opt, root )
    {
        super( opt, root);

        this.width   = 0;   
        this.height  = 0;
        this.root    = root; //该组件被添加到的目标图表项目，

        this.pos     = {
            x : 0,
            y : 0
        };

        this.enabled = false;
        this.type = "poly";

        this.line = {
            lineType : "sold",
            lineWidth : 1,
            strokeStyle : "#ccc"
        };
        this.fill = {
            fillStyle : ["#f9f9f9", "#f3f3f3"],
            alpha : 0.8
        };
        this.dataSection = [];

        this.sprite = null;//总的sprite

        this.animation = true;

        this.induce = null; //最外层的那个网，用来触发事件

        this.init(opt);
    }

    init(opt)
    {
        _.extend(true, this , opt); 
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
        this.sprite.removeAllChildren();
        this.draw( opt );
    }

    _widget()
    {
    
        var me = this;
        _.each( this.dataSection, function( num, i ){
            
            if( num ) {
                var r = me.root.getROfNum( num );
                var points = me.root.getPointsOfR( r );

                var ctx = {
                    //lineType : me.line.lineType,
                    lineWidth : me.line.lineWidth,
                    strokeStyle : me.line.strokeStyle,
                    fillStyle : me._getFillStyle( me.fill.fillStyle , i-1 ),
                    fillAlpha : me.fill.alpha
                };

                var _ring;
                if( me.type == "circle" ){
                    ctx.r = r;
                    _ring = new Circle({
                        context : ctx
                    });
                } else {
                    ctx.pointList = [];
                    _.each( points, function( point , i ){
                        if( i < points.length ){
                            ctx.pointList.push( [ point.x, point.y ] );
                        }
                    } );
                    
                    _ring = new Polygon({
                        context : ctx
                    });
                };
                me.sprite.addChildAt( _ring , 0 );

                if( i == me.dataSection.length-1 ){
                    me.induce = _ring;
                };

                //绘制中心出发的蜘蛛网线
                var aAxisLayoutData = [];
                
                _.each( points, function( point ){
                    var _line = new Line({
                        context : {
                            end : point,
                            lineWidth : me.line.lineWidth,
                            strokeStyle : me.line.strokeStyle
                        }
                    });
                    me.sprite.addChild( _line );
                } );
            }
        } );
    }

    _getFillStyle( style , i )
    {
        if( _.isArray(style) ){
            return style[ i%style.length ]
        }
        return style;
    }
}