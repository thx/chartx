import Canvax from "canvax"
import {getDefaultProps} from "../../utils/tools"

let { _, event } = Canvax;
let Line = Canvax.Shapes.Line;
let Rect = Canvax.Shapes.Rect;

export default class rectGrid extends event.Dispatcher
{
    static defaultProps(){
        return {
            enabled : {
                detail : '是否开启grid绘制',
                default: true
            },
            line : {
                detail : '网格线条配置',
                propertys : {
                    xDimension : {
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
                    yDimension : {
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
                    }
                }
            },
            
            fill : {
                detail : '背景色配置',
                propertys : {
                    xDimension : {
                        detail : '以为方向的背景色块，x方向',
                        propertys : {
                            enabled : {
                                detail : '是否开启',
                                default: false
                            },
                            splitVals : {
                                detail : "从x轴上面用来分割区块的vals",
                                default: null//默认等于xaxis的dataSection
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
                    },
                    yDimension : {
                        detail : '以为方向的背景色块，y方向',
                        propertys : {
                            enabled : {
                                detail : '是否开启',
                                default: false
                            },
                            splitVals : {
                                detail : "从x轴上面用来分割区块的vals",
                                default: null
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
        }
    }

    constructor( opt, _coord )
    {
        super( opt, _coord);
        _.extend( true, this, getDefaultProps( rectGrid.defaultProps() ) );

        this.width   = 0;
        this.height  = 0;
        this._coord  = _coord; //该组件被添加到的目标图表项目，

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
        
        let self  = this;
        if(!this.enabled){
            return
        };

        let _yAxis = self._coord._yAxis[ 0 ];
        let _xAxis = self._coord._xAxis;

        
        this.fillSp = new Canvax.Display.Sprite();
        this.sprite.addChild(this.fillSp);
        _.each( [self.fill.xDimension, self.fill.yDimension], function( fill, ind ){
            let _axis = ind ? _yAxis : _xAxis;
            let splitVals = [];
            if( fill.enabled ){
                if( !fill.splitVals ){
                    splitVals = _axis.dataSection;
                } else {
                    splitVals = [ _axis.dataSection[0] ].concat( _.flatten([ fill.splitVals ]) );
                    splitVals.push( _axis.dataSection.slice(-1)[0] );
                }
                let fillRanges = [];
                if(splitVals.length >=2){

                    let range = [];
                    for(let i=0,l=splitVals.length; i<l; i++){
                        let pos = _axis.getPosOf({
                            val : splitVals[i]
                        });
                        if(!range.length){
                            range.push( pos );
                            continue;
                        }
                        if( range.length == 1 ){
                            if( pos - range[0] < 1 ){
                                continue;
                            } else {
                                range.push( pos );
                                fillRanges.push( range );
                                let nextBegin = range[1]
                                range = [ nextBegin ];
                            }
                        }
                    };
    
                    //fill的区间数据准备好了
                    _.each( fillRanges, function( range, rInd ){

                        let rectCtx = {
                            fillStyle : self.getProp( fill.fillStyle, rInd, "#000" ),
                            fillAlpha : self.getProp( fill.alpha, rInd, 0.02 * (rInd%2) )
                        }
                        if( !ind ){
                            //x轴上面排列的fill
                            rectCtx.x = range[0];
                            rectCtx.y = 0;
                            rectCtx.width = range[1] - range[0];
                            rectCtx.height = -self.height;
                        } else {
                            //y轴上面排列的fill
                            rectCtx.x = 0;
                            rectCtx.y = -range[0]
                            rectCtx.width = self.width;
                            rectCtx.height = -( range[1] - range[0] );
                        }

                        let fillRect = new Rect({
                            context : rectCtx
                        });
                        
                        self.fillSp.addChild( fillRect );
                    } );

                }
            }
        } );


        self.xAxisSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.xAxisSp);
        self.yAxisSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yAxisSp);
        

        let arr = _yAxis.layoutData;
        for(let a = 0, al = arr.length; a < al; a++){
            let o = arr[a];

            if( !o.visible ) continue;
          
            let line = new Line({
                id : "back_line_"+a,
                context : {
                    y : o.y,
                    lineType    : self.getProp( self.line.xDimension.lineType , a , 'solid'),
                    lineWidth   : self.getProp( self.line.xDimension.lineWidth , a , 1),
                    strokeStyle : self.getProp( self.line.xDimension.strokeStyle , a, '#f0f0f0'),
                    visible     : true
                }
            });
            if(self.line.xDimension.enabled){
                self.xAxisSp.addChild(line);
                line.context.start.x = 0;
                line.context.end.x = self.width;
                
            };
        };

        //y轴方向的线集合
        arr = _xAxis.layoutData;
        for(let a = 0, al = arr.length; a < al; a++){
            let o = arr[a]
            let line = new Line({
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
                    lineType    : self.getProp( self.line.yDimension.lineType, a, 'solid'),
                    lineWidth   : self.getProp( self.line.yDimension.lineWidth, a, 1),
                    strokeStyle : self.getProp( self.line.yDimension.strokeStyle, a, '#f0f0f0'),
                    visible     : true
                }
            });
            if(self.line.yDimension.enabled){
                self.yAxisSp.addChild(line);
            };
        };
    }

    getProp( prop, i, def ){
        let res = def;
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