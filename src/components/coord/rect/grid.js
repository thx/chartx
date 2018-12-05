import Canvax from "canvax"
import { _, event } from "mmvis"

const Line = Canvax.Shapes.Line;
const Rect = Canvax.Shapes.Rect;

export default class descartesGrid extends event.Dispatcher
{
    constructor( opt, app )
    {
        super( opt, app);

        this.width  = 0;   
        this.height = 0;
        this.app   = app; //该组件被添加到的目标图表项目，

        this.pos    = {
            x : 0,
            y : 0
        };

        this.enabled = 1;

        this.xDirection = {                                //x方向上的线
            shapeType   : "line",
            enabled     : 1,
            data        : [],                      //[{y:100},{}]
            lineType    : 'solid',                //线条类型(dashed = 虚线 | '' = 实线)
            lineWidth   : 1,
            strokeStyle : '#f0f0f0', //'#e5e5e5',
            filter      : null 
        };
        this.yDirection = {                                //y方向上的线
            shapeType   : "line",
            enabled     : 0,
            data        : [],                      //[{x:100},{}]
            lineType    : 'solid',                      //线条类型(dashed = 虚线 | '' = 实线)
            lineWidth   : 1,
            strokeStyle : '#f0f0f0',//'#e5e5e5',
            filter      : null
        };
        
        this.fill = {
            enabled : true,
            fillStyle : null,
            alpha : null
        };

        this.sprite       = null;                       //总的sprite
        this.xAxisSp      = null;                       //x轴上的线集合
        this.yAxisSp      = null;                       //y轴上的线集合

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
        if(!this.enabled){
            return
        };

        var _yAxis = self.app._yAxis[ 0 ];
        
        if( self.fill.enabled && self.app && _yAxis && _yAxis.dataSectionGroup && _yAxis.dataSectionGroup.length>1 ){
            self.yGroupSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yGroupSp);
            for( var g = 0 , gl=_yAxis.dataSectionGroup.length ; g < gl ; g++ ){
                var yGroupHeight = _yAxis.height / gl ;
                var groupRect = new Rect({
                    context : {
                        x : 0,
                        y : -yGroupHeight * g,
                        width : self.width,
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
        var arr = self.xDirection.data;
        for(var a = 0, al = arr.length; a < al; a++){
            var o = arr[a];
          
            var line = new Line({
                id : "back_line_"+a,
                context : {
                    y : o.y,
                    lineType    : self.xDirection.lineType,
                    lineWidth   : self.xDirection.lineWidth,
                    strokeStyle : self.xDirection.strokeStyle  
                }
            });
            if(self.xDirection.enabled){
                _.isFunction( self.xDirection.filter ) && self.xDirection.filter.apply( line , [{
                    layoutData : self.yDirection.data,
                    index      : a,
                    line       : line
                } , self]);

                self.xAxisSp.addChild(line);
    
                line.context.start.x = 0;
                line.context.end.x = self.width;
                
            };
        };

        //y轴方向的线集合
        var arr = self.yDirection.data
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
                        y : -self.height
                    },
                    lineType    : self.yDirection.lineType,
                    lineWidth   : self.yDirection.lineWidth,
                    strokeStyle : self.yDirection.strokeStyle,
                    visible     : o.x ? true : false
                }
            });
            if(self.yDirection.enabled){
                _.isFunction( self.yDirection.filter ) && self.yDirection.filter.apply(line , [{
                    layoutData : self.xDirection.data,
                    index      : a,
                    line       : line
                } , self ]);
                self.yAxisSp.addChild(line);
            }
        };
    }
}