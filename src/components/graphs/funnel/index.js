import Canvax from "canvax"
import GraphsBase from "../index"
import {numAddSymbol} from "../../../utils/tools"
import { _ , event , getDefaultProps} from "mmvis"

const Text = Canvax.Display.Text;
const Polygon = Canvax.Shapes.Polygon;

export default class FunnelGraphs extends GraphsBase
{
    static defaultProps(){
        return {
            field : {
                detail : '字段配置',
                default: null
            },
            sort: {
                detail : '排序规则',
                default: null
            },
            maxNodeWidth: {
                detail: '最大的元素宽',
                default: null
            },
            minNodeWidth: {
                detail: '最小的元素宽',
                default: 0
            },
            minVal : {
                detail: '漏斗的塔尖',
                default: 0
            },
            node : {
                detail: '单个元素图形配置',
                propertys : {
                    height: {
                        detail: '高',
                        default: 0,
                        documentation : '漏斗单元高，如果options没有设定， 就会被自动计算为 this.height/dataOrg.length'
                    }
                }
            },
            label : {
                detail: '文本配置',
                propertys: {
                    enabled: {
                        detail: '是否开启文本',
                        default: true
                    },
                    textAlign: {
                        detail: '文本布局位置(left,center,right)',
                        default: 'center'
                    },
                    textBaseline: {
                        detail: '文本基线对齐方式',
                        default: 'middle'
                    },
                    format : {
                        detail: '文本格式化处理函数',
                        default: function( num ){ 
                            return numAddSymbol( num );
                        }
                    },
                    fontSize: {
                        detail: '文本字体大小',
                        default: 13
                    },
                    fontColor: {
                        detail: '文本颜色',
                        default: '#ffffff',
                        documentation: 'align为center的时候的颜色，align为其他属性时候取node的颜色'
                    }
                }
            }
        }
    }
    constructor(opt, app)
    {
        super( opt, app );

        this.type = "funnel";

        this.dataOrg = []; //this.dataFrame.getFieldData( this.field )
        this.data  = []; //layoutData list , default is empty Array

        this._maxVal = null;
        this._minVal = null;

        _.extend( true, this , getDefaultProps( FunnelGraphs.defaultProps() ), opt );

        this.init( );
    }

    init()
    {
        
    }

    _computerAttr()
    {
        if( this.field ){
            this.dataOrg = this.dataFrame.getFieldData( this.field );
        };
        this._maxVal = _.max( this.dataOrg );
        this._minVal = _.min( this.dataOrg );
        
        //计算一些基础属性，比如maxNodeWidth等， 加入外面没有设置
        if( !this.maxNodeWidth ){
            this.maxNodeWidth = this.width * 0.7;
        };

        if( !this.node.height ){
            this.node.height = this.height / this.dataOrg.length;
        };

    }

    draw( opt )
    {
        !opt && (opt ={});
        
        //第二个data参数去掉，直接trimgraphs获取最新的data
        _.extend(true, this, opt);

        var me = this;

        var animate = me.animation && !opt.resize;

        this._computerAttr();

        this.data = this._trimGraphs();

        this._drawGraphs();

        this.sprite.context.x = this.origin.x + this.width/2;
        this.sprite.context.y = this.origin.y;

    }

    _trimGraphs()
    {
        if( !this.field ) return;

        var me = this;
        //var dataOrg = _.clone( this.dataOrg );

        var layoutData = [];

        _.each( this.dataOrg, function( num , i ){

            var ld = {
                type    : "funnel",
                field   : me.field,
                rowData : me.dataFrame.getRowDataAt(i),
                value   : num,
                width   : me._getNodeWidth( num ),
                color   : me.app.getTheme(i),//默认从皮肤中获取
                cursor  : "pointer",
               
                //下面得都在layoutData的循环中计算
                label    : '',
                middlePoint : null,
                iNode   : -1,
                points  : []
            };
            layoutData.push( ld );
        } );

        if( this.sort ){
            layoutData = layoutData.sort(function( a, b ){
                if( me.sort == "desc" ){
                    return b.value - a.value;
                } else {
                    return a.value - b.value;
                }
            });
        };

        _.each( layoutData, function( ld , i){
            ld.iNode = i;
            ld.label = me.label.format( ld.value , ld );
        } );
        _.each( layoutData, function( ld , i){
            ld.points = me._getPoints(ld , layoutData[i+1], layoutData[i-1]);
            ld.middlePoint = {
                x : 0,
                y : (ld.iNode + 0.5) * me.node.height
            };
        } );
        
        return layoutData;
    }

    _getNodeWidth( num )
    {
        var width = this.minNodeWidth + ( (this.maxNodeWidth-this.minNodeWidth) / (this._maxVal-this.minVal) * (num-this.minVal) );
        return parseInt( width );
    }

    _getPoints( layoutData , nextLayoutData , preLayoutData )
    {
        var points = [];
        var topY = layoutData.iNode * this.node.height;
        var bottomY = topY + this.node.height;

        if( this.sort !== "asc" ){    
            points.push( [ -layoutData.width/2, topY] ); //左上
            points.push( [ layoutData.width/2, topY] ); //右上

            var bottomWidth = this.minNodeWidth;
            if( nextLayoutData ){
                bottomWidth = nextLayoutData.width;
            };
            points.push( [ bottomWidth/2, bottomY] ); //右下
            points.push( [ -bottomWidth/2, bottomY] ); //左下
        } else {
            //正金字塔结构的话，是从最上面一个 data 的 top 取min开始
            var topWidth = this.minNodeWidth;
            if( preLayoutData ){
                topWidth = preLayoutData.width;
            };
            points.push( [ -topWidth/2, topY] ); //左上
            points.push( [ topWidth/2, topY] ); //右上
            points.push( [ layoutData.width/2, bottomY] ); //右下
            points.push( [ -layoutData.width/2, bottomY] ); //左下
        }

        return points;
    }

    _drawGraphs()
    {
        var me = this;
        _.each( this.data , function( ld ){
            var _polygon = new Polygon({
                context : {
                    pointList : ld.points,
                    fillStyle : ld.color,
                    cursor : ld.cursor
                }
            });
            me.sprite.addChild( _polygon );
            _polygon.nodeData = ld;
            _polygon.on( event.types.get() , function(e) {
                
                e.eventInfo = {
                    trigger: me.node,
                    title : me.field,
                    nodes : [ this.nodeData ]
                };

                //fire到root上面去的是为了让root去处理tips
                me.app.fire( e.type, e );
            });

            var textAlign = "center";
            var textPoint = {
                x : ld.middlePoint.x,
                y : ld.middlePoint.y
            };
            if( me.label.textAlign == "left" ){
                textPoint.x = ld.points[0][0] - (ld.points[0][0] - ld.points[3][0])/2;
                textPoint.x -= 15;
                textAlign = "right";
            };
            if( me.label.textAlign == "right" ){
                textPoint.x = ld.points[1][0] - (ld.points[1][0] - ld.points[2][0])/2
                textPoint.x += 15;
                textAlign = "left";
            };

            var _text = new Text( ld.label , {
                context : {
                    x : textPoint.x,
                    y : textPoint.y,
                    fontSize : me.label.fontSize,
                    fillStyle : me.label.textAlign == "center" ? me.label.fontColor : ld.color,
                    textAlign : textAlign,
                    textBaseline : me.label.textBaseline
                }
            } );

            me.sprite.addChild( _text );
        } );
    }


}
