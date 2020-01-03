import Canvax from "canvax"
import GraphsBase from "../index"
import {getDefaultProps} from "../../../utils/tools"

let _ = Canvax._;

class Progress extends GraphsBase
{
    static defaultProps(){
        return {
            node : {
                detail : '进度条设置',
                propertys : {
                    width : {
                        detail: '进度条的宽度',
                        default : 20
                    },
                    radius : {
                        detail : '进度条两端的圆角半径',
                        default : 10, //默认为width的一半
                    },
                    fillStyle : {
                        detail : '进度条的填充色',
                        documentation : '可以是单个颜色，也可以是数组，也可以是一个函数,也可以是个lineargradient',
                        default : null
                    }
                }
            },
            label : {
                detail : '进度值文本',
                propertys : {
                    enabled   : {
                        detail : '是否启用label',
                        default: 'true'
                    },
                    unit : {
                        detail : '单位值，默认%',
                        default : '%'
                    },
                    unitColor : {
                        detail : '单位值的颜色',
                        default : null
                    },
                    unitFontSize : {
                        detail : '单位值的大小',
                        default : 14
                    },
                    fontColor : {
                        detail : 'label颜色',
                        default : null //默认同node.fillStyle
                    },
                    fontSize  : {
                        detail : 'label文本大小',
                        default: 26
                    },
                    fixNum : {
                        detail : 'toFixed的位数',
                        default: 2
                    },
                    format    : {
                        detail : 'label格式化处理函数',
                        default: function(val){
                            return val.toFixed( this.label.fixNum );
                        }
                    },
                    lineWidth : {
                        detail : 'label文本描边线宽',
                        default: null
                    },
                    strokeStyle : {
                        detail : 'label描边颜色',
                        default: null
                    },
                    
                    rotation : {
                        detail : 'label旋转角度',
                        default: 0
                    },
                    textAlign :{
                        detail : 'label textAlign',
                        default:  'center',
                        values :  ['left','center','right']
                    },  //left center right
                    verticalAlign : {
                        detail : 'label verticalAlign',
                        default: 'middle',
                        values : [ 'top', 'middle', 'bottom' ]
                    }, //top middle bottom
                    position : {
                        detail : 'label位置',
                        default: 'origin'
                    }, 
                    offsetX : {
                        detail : 'label在x方向的偏移量',
                        default: 0
                    },
                    offsetY : {
                        detail : 'label在y方向的偏移量',
                        default: 0
                    }
                }
            },
            bgEnabled : {
                detail : '是否开启背景',
                default : true
            },
            bgColor : {
                detail : '进度条背景颜色',
                default : '#f7f7f7'
            },
            radius : {
                detail : '半径',
                default : null
            },
            allAngle : {
                detail : '总角度',
                documentation: '默认为null，则和坐标系同步',
                default : null
            },
            startAngle : {
                detail : '其实角度',
                documentation: '默认为null，则和坐标系同步',
                default : null
            }
        }
    } 
    

    constructor(opt, app)
    {
        super(opt, app);
        this.type = "progress";

        _.extend( true, this, getDefaultProps( Progress.defaultProps() ), opt );
        
        this.bgNodeData = null;//背景的nodeData数据，和data里面的结构保持一致
        this.init();
    }

    init(){

    }

    draw(opt)
    {
        !opt && (opt ={});
        
        let me = this;
        _.extend(true, this, opt);

        me.grow( function( process ){
            me.data = me._trimGraphs( process );
            me._widget();
        } );

        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;
    }

    _trimGraphs( scale )
    {
        let me = this;

        if( scale == undefined ){
            scale = 1
        };

        let _coord = this.app.getComponent({name:'coord'});

        //用来计算下面的hLen
        this.enabledField = _coord.filterEnabledFields( this.field );

        //整个的
        let _startAngle = me.startAngle || _coord.startAngle;
        let _allAngle = me.allAngle || _coord.allAngle;
        //let _endAngle = startAngle + allAngle;
        
        this.bgNodeData = this._getNodeData( _startAngle, _allAngle );
        this.bgNodeData.fillStyle = this._getStyle( this.bgNodeData, this.bgColor );

        let data = {};
        _.each( this.enabledField, function( field ){
            let dataOrg = me.dataFrame.getFieldData(field);

            let nodeDatas = [];

            _.each( dataOrg, function( val, i ){
                val *= scale;
                let preNodeData = nodeDatas.slice(-1)[0];
                let startAngle = preNodeData ? preNodeData.endAngle : _startAngle;
                let allAngle = _allAngle * (val/100);
                let nodeData = me._getNodeData( startAngle, allAngle , field, val,i);
                nodeData.fillStyle = me._getStyle( nodeData, me.node.fillStyle );
                nodeDatas.push( nodeData );
            } );

            data[ field ] = nodeDatas;
        } );
        return data;
    }

    _getNodeData(startAngle, allAngle, field, val, i){
        let me = this;
        let _coord = this.app.getComponent({name:'coord'});
        let middleAngle = startAngle + allAngle/2;
        let endAngle = startAngle + allAngle;


        let startRadian = Math.PI * startAngle / 180; //起始弧度
        let middleRadian = Math.PI * middleAngle / 180;
        let endRadian = Math.PI * endAngle / 180; //终点弧度

        let outRadius= me.radius || _coord.radius;
        let innerRadius = outRadius - me.node.width;

        let startOutPoint = _coord.getPointInRadianOfR( startRadian, outRadius );
        let middleOutPoint = _coord.getPointInRadianOfR( middleRadian, outRadius );
        let endOutPoint = _coord.getPointInRadianOfR( endRadian, outRadius );
        
        let startInnerPoint = _coord.getPointInRadianOfR( startRadian, innerRadius );
        let middleInnerPoint = _coord.getPointInRadianOfR( middleRadian, innerRadius );
        let endInnerPoint = _coord.getPointInRadianOfR( endRadian, innerRadius );

        let nodeData = {
            field           : field,
            value           : val,
            text            : val, //value format后的数据
            iNode           : i,
            allAngle        : allAngle,

            startAngle      : startAngle,
            middleAngle     : middleAngle,
            endAngle        : endAngle,

            startRadian     : startRadian,
            middleRadian    : middleRadian,
            endRadian       : endRadian,

            outRadius       : outRadius,
            innerRadius     : innerRadius,
            
            startOutPoint   : startOutPoint,
            middleOutPoint  : middleOutPoint,
            endOutPoint     : endOutPoint,

            startInnerPoint : startInnerPoint,
            middleInnerPoint: middleInnerPoint,
            endInnerPoint   : endInnerPoint,
         
            rowData         : me.dataFrame.getRowDataAt( i ),
            fillStyle       : null
        };

        if( field ){
            if( me.label.format && _.isFunction( me.label.format ) ){
                nodeData.text = me.label.format.apply( this, [ val, nodeData ] );
            };
        };

        /*  样式的设置全部在外面处理
        if( field ){
            //没有field的说明是bgNodeData的调用,
            nodeData.fillStyle = me._getStyle( nodeData, me.node.fillStyle );
        };
        */

        /*
        if( allAngle%360 > 180 ){
            nodeData.large_arc_flag = 1;
        };
        */
        return nodeData;
    }

    _widget(){
        let me = this;

        if( me.bgEnabled ){
            let bgPathStr = me._getPathStr( this.bgNodeData );
            if( me._bgPathElement ){
                me._bgPathElement.context.path = bgPathStr;
            } else {
                me._bgPathElement = new Canvax.Shapes.Path({
                    context : {
                        path : bgPathStr
                    }
                });
                me.sprite.addChild( me._bgPathElement );
            };
            me._bgPathElement.context.fillStyle = this.bgNodeData.fillStyle;
        };

        _.each( this.data, function( nodeDatas ){
            _.each( nodeDatas, function(nodeData,i){
                let pathStr = me._getPathStr( nodeData );

                let elId = "progress_bar_"+nodeData.field+"_"+i;
                let pathElement = me.sprite.getChildById( elId );
                if( pathElement ){
                    pathElement.context.path = pathStr;
                } else {
                    pathElement = new Canvax.Shapes.Path({
                        id : elId,
                        context : {
                            path : pathStr
                        }
                    });
                    me.sprite.addChild( pathElement );
                };
                
                pathElement.context.fillStyle = nodeData.fillStyle;

                if( me.label.enabled ){

                    let labelSpId = "progress_label_"+nodeData.field+"_sprite_"+i;
                    let labelSpElement = me.sprite.getChildById( labelSpId );
                    if( labelSpElement ){
                        labelSpElement
                    } else {
                        labelSpElement = new Canvax.Display.Sprite({
                            id : labelSpId
                        });
                        me.sprite.addChild( labelSpElement );
                    };
                    labelSpElement.context.x = me.label.offsetX - 6; //%好会占一部分位置 所以往左边偏移6
                    labelSpElement.context.y = me.label.offsetY;
                    
                    let labelCtx = {
                        fillStyle   : me.label.fontColor || nodeData.fillStyle,
                        fontSize    : me.label.fontSize,
                        lineWidth   : me.label.lineWidth,
                        strokeStyle : me.label.strokeStyle,
                        textAlign   : me.label.textAlign,
                        textBaseline: me.label.verticalAlign,
                        rotation    : me.label.rotation
                    };
                    
                    let labelId = "progress_label_"+nodeData.field+"_"+i;
                    let labelElement = labelSpElement.getChildById( labelId );
                    if( labelElement ){
                        labelElement.resetText( nodeData.text );
                        _.extend( labelElement.context, labelCtx );
                    } else {
                        labelElement = new Canvax.Display.Text( nodeData.text, {
                            id : labelId,
                            context : labelCtx
                        } );
                        labelSpElement.addChild( labelElement );
                    };

                    let labelSymbolId = "progress_label_"+nodeData.field+"_symbol_"+i;
                    let labelSymbolElement = labelSpElement.getChildById( labelSymbolId );
                    let lebelSymbolCxt = {
                        x            : labelElement.getTextWidth()/2 + 2,
                        y            : 3,
                        fillStyle    : me.label.unitColor || me.label.fontColor || nodeData.fillStyle,
                        fontSize     : me.label.unitFontSize,
                        textAlign    : "left",
                        textBaseline : me.label.verticalAlign
                    };
                   
                    if( labelSymbolElement ){
                        _.extend( labelSymbolElement.context, lebelSymbolCxt );
                    } else {
                        
                        let unitText = me.label.unit;
                        labelSymbolElement = new Canvax.Display.Text( unitText, {
                            id : labelSymbolId,
                            context : lebelSymbolCxt
                        } );
                        labelSpElement.addChild( labelSymbolElement );
                    };
                
                };
            } );
        } );

    }

    _getPathStr( nodeData ){
        let pathStr = "M"+nodeData.startOutPoint.x+" "+nodeData.startOutPoint.y;
        pathStr += "A"+nodeData.outRadius+" "+nodeData.outRadius+" 0 0 1 " + nodeData.middleOutPoint.x + " "+ nodeData.middleOutPoint.y;
        pathStr += "A"+nodeData.outRadius+" "+nodeData.outRadius+" 0 0 1 " + nodeData.endOutPoint.x + " "+ nodeData.endOutPoint.y;

        let actionType = "L";
        if( nodeData.allAngle % 360 == 0 ){
            //actionType = "M" 
        };

        pathStr += actionType+nodeData.endInnerPoint.x+" "+nodeData.endInnerPoint.y;
        
        pathStr += "A"+nodeData.innerRadius+" "+nodeData.innerRadius+" 0 0 0 " + nodeData.middleInnerPoint.x + " "+ nodeData.middleInnerPoint.y;
        pathStr += "A"+nodeData.innerRadius+" "+nodeData.innerRadius+" 0 0 0 " + nodeData.startInnerPoint.x + " "+ nodeData.startInnerPoint.y;
        
        pathStr += "Z";
        return pathStr;
    }

    _getStyle( nodeData, prop, def ){
        let me = this;
        let _coord = this.app.getComponent({name:'coord'});
        let fieldMap = _coord.getFieldMapOf( nodeData.field );
        def = def || (fieldMap ? fieldMap.color : "#171717");

        let style;
        if( prop ){
            if( _.isString(prop) ){
                style = prop;
            };
            if( _.isArray(prop) ){
                style = prop[ nodeData.iNode ];
            };
            if( _.isFunction(prop) ){
                style = prop.apply( this, arguments );
            };
            if( prop && prop.lineargradient ){
    
                style = me.ctx.createLinearGradient( nodeData.startOutPoint.x ,nodeData.startOutPoint.y, nodeData.endOutPoint.x, nodeData.endOutPoint.y );
                _.each( prop.lineargradient , function( item ){
                    style.addColorStop( item.position , item.color);
                });
    
            };
        }
        if( !style ){
            style = def;
        }
        return style;
    }
    


}

GraphsBase.registerComponent( Progress, 'graphs', 'progress' );

export default Progress;