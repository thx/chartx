import Component from "../component"
import Canvax from "canvax2d"

const Line = Canvax.Shapes.Line;
const Rect = Canvax.Shapes.Rect;
const _ = Canvax._;

export default class Grid extends Component
{
    constructor( opt, root )
    {
        super( opt, root);

        this.w       = 0;   
        this.h       = 0;
        this.root    = root; //该组件被添加到的目标图表项目，

        this.pos     = {
            x : 0,
            y : 0
        }

        this.display = 1;

        this.xAxis   = {                                //x轴上的线
            display     : 1,
            data        : [],                      //[{y:100},{}]
            org         : null,                    //x轴坐标原点，默认为上面的data[0]
            // data     : [{y:0},{y:-100},{y:-200},{y:-300},{y:-400},{y:-500},{y:-600},{y:-700}],
            lineType    : 'solid',                //线条类型(dashed = 虚线 | '' = 实线)
            lineWidth   : 1,
            strokeStyle : '#f0f0f0', //'#e5e5e5',
            filter      : null 
        }
        this.yAxis = {                                //y轴上的线
            display     : 0,
            data        : [],                      //[{x:100},{}]
            xDis        : 0,
            org         : null,                    //y轴坐标原点，默认为上面的data[0]
            // data     : [{x:100},{x:200},{x:300},{x:400},{x:500},{x:600},{x:700}],
            lineType    : 'solid',                      //线条类型(dashed = 虚线 | '' = 实线)
            lineWidth   : 1,
            strokeStyle : '#f0f0f0',//'#e5e5e5',
            filter      : null
        } 
        this.fill = {
            fillStyle : null,
            alpha : null
        }

        this.sprite       = null;                       //总的sprite
        this.xAxisSp      = null;                       //x轴上的线集合
        this.yAxisSp      = null;                       //y轴上的线集合

        this.animation = true;
        this.resize = false;

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
        //this._configData(opt);
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
        
        var self  = this;
        if(!this.display){
            return
        };

        var _yAxis = self.root._yAxis[ 0 ];
        
        if( self.root && _yAxis && _yAxis.dataSectionGroup ){
            self.yGroupSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yGroupSp);
            for( var g = 0 , gl=_yAxis.dataSectionGroup.length ; g < gl ; g++ ){
                var yGroupHeight = _yAxis.height / gl ;
                var groupRect = new Rect({
                    context : {
                        x : 0,
                        y : -yGroupHeight * g,
                        width : self.w,
                        height : -yGroupHeight,
                        fillStyle : self.fill.fillStyle || "#000",
                        fillAlpha : self.fill.alpha || 0.025 * (g%2)
                    }
                });
                
                self.yGroupSp.addChild( groupRect );
            };
        };

        self.xAxisSp   = new Canvax.Display.Sprite(),  self.sprite.addChild(self.xAxisSp);
        self.yAxisSp   = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yAxisSp);
        
        //x轴方向的线集合
        var arr = self.xAxis.data;
        for(var a = 0, al = arr.length; a < al; a++){
            var o = arr[a];
          
            var line = new Line({
                id : "back_line_"+a,
                context : {
                    y : o.y,
                    lineType    : self.xAxis.lineType,
                    lineWidth   : self.xAxis.lineWidth,
                    strokeStyle : self.xAxis.strokeStyle  
                }
            });
            if(self.xAxis.display){
                _.isFunction( self.xAxis.filter ) && self.xAxis.filter.apply( line , [{
                    layoutData : self.yAxis.data,
                    index      : a,
                    line       : line
                } , self]);

                self.xAxisSp.addChild(line);
    
                line.context.start.x = 0;
                line.context.end.x = self.w;
                
            };
        };

        //y轴方向的线集合
        var arr = self.yAxis.data
        for(var a = 0, al = arr.length; a < al; a++){
            var o = arr[a]
            var line = new Line({
                context : {
                    x : o.x,
                    start       : {
                        x : 0,
                        y : 0
                    },
                    end         : {
                        x : 0,
                        y : -self.h
                    },
                    lineType    : self.yAxis.lineType,
                    lineWidth   : self.yAxis.lineWidth,
                    strokeStyle : self.yAxis.strokeStyle,
                    visible     : o.x ? true : false
                }
            })
            if(self.yAxis.display){
                _.isFunction( self.yAxis.filter ) && self.yAxis.filter.apply(line , [{
                    layoutData : self.xAxis.data,
                    index      : a,
                    line       : line
                } , self ]);
                self.yAxisSp.addChild(line);
            }
        };
    }
}