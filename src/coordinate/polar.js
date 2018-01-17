import Chart from "../chart"
import Canvax from "canvax2d"
import {parse2MatrixData} from "../utils/tools"
import DataFrame from "../utils/dataframe"
import Coordinate from "../components/polar/index"

const _ = Canvax._;

export default class Polar extends Chart
{
    constructor( node, data, opts, graphsMap, componentsMap )
    {
        super( node, data, opts );

        this.graphsMap = graphsMap;
        this.componentsMap = componentsMap;

        var me = this;

        _.extend(true, this, opts);

        //强制把graphs设置为数组
        this.graphs = _.flatten( [ this.graphs ] );
        
        //这里不要直接用data，而要用 this._data
        this.dataFrame = this.initData( this._data );

        this.draw();
    }

    draw()
    {
        this._initModule(); //初始化模块  
        this.initComponents(); //初始化组件
        this._startDraw(); //开始绘图
        this.drawComponents();  //绘图完，开始绘制插件
        this.inited = true;
    }

    _initModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new Coordinate( this.coordinate, this );
        this.coordinateSprite.addChild( this._coordinate.sprite );

        _.each( this.graphs , function( graphs ){
            var _g = new me.graphsMap[ graphs.type ]( graphs, me );
            me._graphs.push( _g );
            me.graphsSprite.addChild( _g.sprite );
        } );
    }

    initComponents( opt )
    {
        if(this._opts.tips && this._initTips){
            this._initTips( opt );
        }
        if(this._opts.legend && this._initLegend){
            this._initLegend( opt );
        };

    }

    //所有plug触发更新
    componentsReset( trigger )
    {
        var me = this;
        _.each(this.components , function( p , i ){
            p.plug.reset && p.plug.reset( me[ p.type ] || {} , me.dataFrame);
        }); 
    }

    _startDraw(opt)
    {
        var me = this;
        !opt && (opt ={});
        var _coor = this._coordinate;

        //先绘制好坐标系统
        _coor.draw( opt );

        var graphsCount = this._graphs.length;
        var completeNum = 0;
        _.each( this._graphs, function( _g ){
            _g.on( "complete", function(g) {
                completeNum ++;
                if( completeNum == graphsCount ){
                    me.fire("complete");
                }
            });
            
            _g.draw({
                width : _coor.width,
                height : _coor.height,
                origin : _coor.origin //坐标系圆心
            } );
        } );

        //this.bindEvent();
    }

}