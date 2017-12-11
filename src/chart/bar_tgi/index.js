import Canvax from "canvax2d"
import Bar from "../bar/index"
import BarGraphs from "../bar/graphs"
import Tips from "../../components/tips/index"
import Coordinate from "../../components/descartes/index"


const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class Bar_Tgi extends Bar
{
    constructor( node, data, opts )
    {
        super( node, data, opts ); 
    }

    _init( node, data, opts ) 
    {
        var me = this;

        //兼容下没有传任何参数的情况下，默认把第一个field作为x，第二个作为柱状图，第三个作为折线图
        if( !this.coordinate.xAxis.field ){
            this.coordinate.xAxis.field = this.dataFrame.fields[0];
        };
        if( !this.coordinate.yAxis ){
            this.coordinate.yAxis = [
                { field : [this.dataFrame.fields[1]] },
                { field : [this.dataFrame.fields[2]] }
            ]
        };
        //默认设置结束

        this.coordinate.yAxis[1].middleweight = 100;
        this.coordinate.yAxis[1].dataSection = this._getTgiYaxisDataSection();

        this._tgiSpt = null; //tgi内容的容器根目录
    
    }

    draw( opt ) 
    {
        !opt && (opt ={});
        this.setStages(opt);
        if (this.rotate) {
            this._rotate(this.rotate);
        };
        this._initBarModule( opt ); //初始化模块  
        this.initPlugsModules( opt ); //初始化组件
        this._startDraw( opt ); //开始绘图
        this.drawPlugs( opt );  //绘图完，开始绘制插件

        this._tgiDraw(); //开始绘制 Tgi

        this.inited = true;
    }

    _initBarModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new Coordinate( this.coordinate, this );
        this.core.addChild( this._coordinate.sprite );

        this._graphs = new BarGraphs(this.graphs, this);
        this._graphs._yAxis = [ this._coordinate._yAxis[0] ];
        this.core.addChild(this._graphs.sprite);

        this._tips = new Tips(this.tips, this.canvax.domView);
        this.stageTip.addChild(this._tips.sprite);

    }

    _getTgiData()
    {
        var me = this;
        this._tgiData = [];
        var tgiFields = _.flatten( [ this.coordinate.yAxis[1].field ] );

        _.each( tgiFields , function( field , i ){
            me._tgiData.push( _.find(me.dataFrame.data, function(item) {
                return item.field == field
            }) )
        } );
        return this._tgiData
    }

    _getTgiYaxisDataSection()
    {
        var dataSection = [ 0 , 100 ];
        var max = 200;

        _.each( this._getTgiData(), function( td, i ){
            _.each( td.data , function( d ){
                max = Math.max( max , Number(d) );
            } );
        } );

        if( max > 100 ){
            dataSection.push( Math.ceil(max/100)*100 );
        };

        return dataSection;
    }


    _tgiDraw()
    {
        
        this._tgiSpt = new Canvax.Display.Sprite({
            id: 'tgiBg',
            context: {
                x: this._coordinate.graphsX,
                y: this._coordinate.graphsY
            }
        });

        this.core.addChildAt(this._tgiSpt, 0);

        var midLineY = this._coordinate._yAxisRight.getYposFromVal( 100 );
        var midLine = new Line({
            context: {
                start : {
                    x : this._coordinate.graphsWidth,
                    y : midLineY
                },
                end : {
                    x : 0,
                    y : midLineY
                },
                lineWidth: 2,
                strokeStyle: "#ccc"
            }
        });

        this._tgiSpt.addChild(midLine);

        this._tgiGraphs = new Canvax.Display.Sprite({
            id: 'tgiGraphs',
            context: {
                x: this._coordinate.graphsX,
                y: this._coordinate.graphsY
            }
        });
        this.core.addChild(this._tgiGraphs);

        this._tgiGraphsDraw();

        var me = this;
        this.plugs.push({
            type : "tgi",
            plug : {
                reset : function(){
                    me.redraw()
                }
            }
        });
    }

    redraw()
    {
        var me = this;
        
        //因为_yAxisRight用得dataSection  所以需要reset的时候动态重新设置dataSection，才会修改
        this._coordinate._yAxisRight.reset( {
            dataSection : this._getTgiYaxisDataSection()
        } );
        this._tgiGraphs.removeAllChildren();
        this._tgiGraphsDraw();
    }

    _tgiGraphsDraw()
    {

        var me = this;
        _.each( this._tgiData , function( group , gi ){
            _.each( group.data , function( num, i ){
                var rectData = _.flatten( me._graphs.data[gi] )[i];
                if( !rectData ) return;
                
                var y = me._coordinate._yAxisRight.getYposFromVal( num );
                
                var tgiLine = new Line({
                    context: {
                        start : {
                            x : rectData.x,
                            y : y
                        },
                        end : {
                            x : rectData.x + rectData.width,
                            y : y
                        },
                        lineWidth: 2,
                        strokeStyle: (num > 100 ? "#43cbb5" : "#ff6060")
                    }
                });
                me._tgiGraphs.addChild(tgiLine);
            });
        } );
    }
}