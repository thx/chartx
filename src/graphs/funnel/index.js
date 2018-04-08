import Canvax from "canvax2d"
import GraphsBase from "../index"
import {numAddSymbol} from "../../utils/tools"

const _ = Canvax._;
const Text = Canvax.Display.Text;
const Polygon = Canvax.Shapes.Polygon;

export default class FunnelGraphs extends GraphsBase
{
    constructor(opts, root)
    {
        super( opts, root );

        this.type = "funnel";

        this.field = null;
        this.dataOrg = []; //this.dataFrame.getFieldData( this.field )
        this.data  = []; //layoutData list , default is empty Array
        this.sort = null;

        this.maxVal = null;
        this.minVal = null;
        this.maxNodeWidth = null;
        this.minNodeWidth = 0;

        this.node = {
            shapeType   : "polygon", //节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现
            height : 0, //漏斗单元高，如果options没有设定， 就会被自动计算为 this.height/dataOrg.length
            focus : {
                enabled : true
            },
            select : {
                enabled : true,
                lineWidth : 2,
                strokeStyle : "#666"
            }
        };

        this.text = {
            enabled : true,
            align : "center", // left , center, right
            format : function( num ){ 
                return numAddSymbol( num );
            },
            fontColor : "#ffffff",
            fontSize : 13,
            textAlign : "center",
            textBaseline : "middle"
        }

        _.extend( true, this , opts );

        this.init( );
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            name : "funnelGraphsEl"
        });
        
    }

    _computerAttr()
    {
        if( this.field ){
            this.dataOrg = this.dataFrame.getFieldData( this.field );
        };
        this.maxVal = _.max( this.dataOrg );
        this.minVal = _.min( this.dataOrg );
        
        //计算一些基础属性，比如maxNodeWidth等， 加入外面没有设置
        if( !this.maxNodeWidth ){
            this.maxNodeWidth = this.width * 0.8;
        };

        if( !this.node.height ){
            this.node.height = this.height / this.dataOrg.length;
        };
    }

    draw( opts )
    {
        !opts && (opts ={});
        
        //第二个data参数去掉，直接trimgraphs获取最新的data
        _.extend(true, this, opts);

        var me = this;

        var animate = me.animation && !opts.resize;

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
                rowData : me.dataFrame.getRowData(i),
                value   : num,
                width   : me._getNodeWidth( num ),
                color   : me.root._theme[i],//默认从皮肤中获取
                cursor  : "pointer",
               
                //下面得都在layoutData的循环中计算
                text    : '',
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
            ld.text = me.text.format( ld.value , ld );
        } );
        _.each( layoutData, function( ld , i){
            ld.points = me._getPoints(ld , layoutData[i+1]);
            ld.middlePoint = {
                x : 0,
                y : (ld.iNode + 0.5) * me.node.height
            };
        } );
        
        return layoutData;
    }

    _getNodeWidth( num )
    {
        var width = this.minNodeWidth + ( (this.maxNodeWidth-this.minNodeWidth) / this.maxVal * num );
        return parseInt( width );
    }

    _getPoints( layoutData , nextLayoutData )
    {
        var points = [];
        var topY = layoutData.iNode * this.node.height;
        var bottomY = topY + this.node.height;
        points.push( [ -layoutData.width/2, topY] ); //左上
        points.push( [ layoutData.width/2, topY] ); //右上

        var bottomWidth = this.minNodeWidth;
        if( nextLayoutData ){
            bottomWidth = nextLayoutData.width;
        };
        points.push( [ bottomWidth/2, bottomY] ); //右下
        points.push( [ -bottomWidth/2, bottomY] ); //左下

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
            _polygon.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {
                
                e.eventInfo = {
                    title : me.field,
                    nodes : [ this.nodeData ]
                };

                //fire到root上面去的是为了让root去处理tips
                me.root.fire( e.type, e );
                me.triggerEvent( me.node , e );
            });

            var _text = new Text( ld.text , {
                context : {
                    x : ld.middlePoint.x,
                    y : ld.middlePoint.y,
                    fontSize : me.text.fontSize,
                    fillStyle : me.text.fontColor,
                    textAlign : me.text.textAlign,
                    textBaseline : me.text.textBaseline
                }
            } );

            me.sprite.addChild( _text );
        } );
    }


}
