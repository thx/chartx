import Canvax from "canvax"
import { _, event,getDefaultProps } from "mmvis"

const Line = Canvax.Shapes.Line;
const Rect = Canvax.Shapes.Rect;

export default class rectGrid extends event.Dispatcher
{
    static defaultProps(){
        return {
            enabled : {
                detail : '是否开启grid绘制',
                default: true
            },
            oneDimension : {
                detail : '一维方向的网格线',
                propertys : {
                    enabled : {
                        detail : '是否开启',
                        default: true
                    },
                    data : [],
                    lineType : {
                        detail : '线的样式，虚线或者实现',
                        default: 'solid'
                    },
                    lineWidth : {
                        detail : '线宽',
                        default: 1
                    },
                    strokeStyle : {
                        detail : '线颜色',
                        default: '#f0f0f0'
                    }
                }
            },
            twoDimension : {
                detail : '二维方向的网格线',
                propertys : {
                    enabled : {
                        detail : '是否开启',
                        default: false
                    },
                    data : [],
                    lineType : {
                        detail : '线的样式，虚线或者实现',
                        default: 'solid'
                    },
                    lineWidth : {
                        detail : '线宽',
                        default: 1
                    },
                    strokeStyle : {
                        detail : '线颜色',
                        default: '#f0f0f0'
                    }
                }
            },
            fill : {
                detail : '背景',
                propertys : {
                    enabled : {
                        detail : '是否开启',
                        default: false
                    },
                    fillStyle : {
                        detail : '背景颜色',
                        default: null
                    },
                    alpha : {
                        detail : '背景透明度',
                        default: null
                    }
                }
            }
        }
    }

    constructor( opt, app )
    {
        super( opt, app);
        _.extend( true, this, getDefaultProps( rectGrid.defaultProps() ) );

        this.width   = 0;
        this.height  = 0;
        this.app     = app; //该组件被添加到的目标图表项目，

        this.pos     = {
            x : 0,
            y : 0
        };

        this.sprite  = null;                       //总的sprite
        this.xAxisSp = null;                       //x轴上的线集合
        this.yAxisSp = null;                       //y轴上的线集合

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
            
            for( var g = 0 , gl = _yAxis.dataSectionGroup.length ; g < gl ; g++ ){
                
                var beginY =_yAxis.getPosOf({
                    val : _yAxis.dataSectionGroup[g][0]
                });
                var endY =_yAxis.getPosOf({
                    val : _yAxis.dataSectionGroup[g].slice(-1)[0]
                });
                
                var groupRect = new Rect({
                    context : {
                        x : 0,
                        y : -beginY,
                        width : self.width,
                        height : -( endY - beginY ),
                        fillStyle : self.getProp( self.fill.fillStyle, g, "#000" ),
                        fillAlpha : self.getProp( self.fill.alpha, g, 0.025 * (g%2) )
                    }
                });
                
                self.yGroupSp.addChild( groupRect );
            };
        };

        self.xAxisSp   = new Canvax.Display.Sprite(),  self.sprite.addChild(self.xAxisSp);
        self.yAxisSp   = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yAxisSp);
        
        //x轴方向的线集合
        var arr = self.oneDimension.data;
        
        for(var a = 0, al = arr.length; a < al; a++){
            var o = arr[a];

            if( !o.visible ) continue;
          
            var line = new Line({
                id : "back_line_"+a,
                context : {
                    y : o.y,
                    lineType    : self.getProp( self.oneDimension.lineType , a , 'solid'),
                    lineWidth   : self.getProp( self.oneDimension.lineWidth , a , 1),
                    strokeStyle : self.getProp( self.oneDimension.strokeStyle , a, '#f0f0f0'),
                    visible     : true
                }
            });
            if(self.oneDimension.enabled){
                self.xAxisSp.addChild(line);
                line.context.start.x = 0;
                line.context.end.x = self.width;
                
            };
        };

        //y轴方向的线集合
        var arr = self.twoDimension.data
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
                    lineType    : self.getProp( self.twoDimension.lineType, a, 'solid'),
                    lineWidth   : self.getProp( self.twoDimension.lineWidth, a, 1),
                    strokeStyle : self.getProp( self.twoDimension.strokeStyle, a, '#f0f0f0'),
                    visible     : true
                }
            });
            if(self.twoDimension.enabled){
                self.yAxisSp.addChild(line);
            };
        };
    }

    getProp( prop, i, def ){
        var res = def || prop;
        if( prop != null && prop != undefined ){
            if( _.isString( prop ) || _.isNumber( prop ) ){
                res = prop;
            }
            if( _.isFunction( prop ) ){
                res = prop.apply( this, [ i, def ] );
            }
            if( _.isArray( prop ) ){
                res = prop[ i ]
            }
        };
        return res;
    }
}