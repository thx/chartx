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
                                default: '#e6e6e6'
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
                            splitLabels : {
                                detail : "对应splitVals的文本",
                                default: null
                            },
                            fontColor : {
                                detail : "对应splitLabels的文本颜色",
                                default: null
                            },
                            fontSize : {
                                detail : "对应splitLabels的文本字体大小",
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
                            splitLabels : {
                                detail : "对应splitVals的文本",
                                default: null
                            },
                            fontColor : {
                                detail : "对应splitLabels的文本颜色",
                                default: null
                            },
                            fontSize : {
                                detail : "对应splitLabels的文本字体大小",
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
                
                if (!fill.splitVals) {
                    splitVals = _axis.dataSection;
                  } else {
                    splitVals = _.flatten([fill.splitVals]);

                    // splitVals = [_axis.dataSection[0]].concat(_.flatten([fill.splitVals]));
                    // let lastSectionVal = _axis.dataSection.slice(-1)[0];
                    // if( splitVals.indexOf( lastSectionVal ) == -1 ){
                    //   splitVals.push( lastSectionVal );
                    // }
                };

                let fillRanges = [];
                if( splitVals.length ){

                    //splitVals去重
                    splitVals = _.uniq( splitVals )

                    let range = [0];
                    for(let i=0,l=splitVals.length; i<l; i++){
                        let val = splitVals[i];
                        let pos = _axis.getPosOf({
                            val
                        });
                        
                        if( range.length == 1 ){
                            
                            //TODO: 目前轴的计算有bug， 超过的部分返回也是0
                            // if( (
                            //         splitVals.length == 1 || 
                            //         (
                            //             splitVals.length > 1 && 
                            //             ( 
                            //                 fillRanges.length && (fillRanges.slice(-1)[0][0] || fillRanges.slice(-1)[0][1] )
                            //             ) 
                            //         )
                            //     ) && pos == 0 ){
                            //     pos = self.width;
                            // };

                            if( !pos &&  _axis.type == 'xAxis' ){
                            
                                let dataFrame = self._coord.app.dataFrame;
                                let orgData = _.find( dataFrame.jsonOrg, function(item){
                                    return item[ _axis.field ] == val;
                                } )
                                if( orgData ){
                                    let orgIndex = orgData.__index__;
                                    if( orgIndex <= dataFrame.range.start ){
                                        pos = 0;
                                    }
                                    if( orgIndex >= dataFrame.range.end ){
                                        pos = self.width;
                                    }
                                }

                            }

                            if( _axis.layoutType == 'peak' ){
                                pos += _axis._cellLength/2
                            }

                            range.push( pos );
                            fillRanges.push( range );
                            let nextBegin = range[1]
                            range = [ nextBegin ];
                        }
                    };
    
                    //fill的区间数据准备好了
                    _.each( fillRanges, function( range, rInd ){

                        if( !range || ( range && range.length && range[1] == range[0]) ) return;

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


                        let _text = self.getProp( fill.splitLabels, rInd, "" );
                        
                        if( _text ){
                            let fontColor = self.getProp( fill.fontColor, rInd, "#666" );
                            let fontSize = self.getProp( fill.fontSize, rInd, 12 );
                            let textAlign = 'center';
                            let textBaseline = 'top';
                            let x = rectCtx.x + rectCtx.width/2;
                            let y = rectCtx.height + 8;
                            if( ind ){
                                //y轴上面排列的fill
                                textAlign = 'left';
                                textBaseline = 'middle';
                                x = rectCtx.x + 8;
                                y = rectCtx.y + rectCtx.height/2;
                            }
                            let txt = new Canvax.Display.Text( _text , {
                                context: {
                                    fontSize,
                                    fillStyle: fontColor,
                                    x,
                                    y,
                                    textAlign,  //"center",//this.isH ? "center" : "left",
                                    textBaseline//"middle", //this.isH ? "top" : "middle",
                                }
                            });
                            self.fillSp.addChild( txt );
                        }
                        

                    } );

                }
            }
        } );


        self.xAxisSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.xAxisSp);
        self.yAxisSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yAxisSp);
        
        let arr = _yAxis? _yAxis.layoutData : [];
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