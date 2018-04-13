import Canvax from "canvax2d"

const Line = Canvax.Shapes.Line;
const Circle = Canvax.Shapes.Circle;
const Polygon = Canvax.Shapes.Polygon;

const _ = Canvax._;

export default class polarGrid extends Canvax.Event.EventDispatcher
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
            strokeStyle : "#e5e5e5"
        };
        this.fill = {
            fillStyle : null, //["#f9f9f9", "#f7f7f7"],
            alpha : 0.5
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
                var ringType = Circle;
                if( me.type == "circle" ){
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

    _getFillStyle( color , i )
    {
        if( _.isArray(color) ){
            return color[ i%color.length ]
        }
        return color;
    }
}