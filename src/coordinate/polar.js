import CoordinateBase from "./index"
import Canvax from "canvax2d"
import {parse2MatrixData} from "../utils/tools"
import DataFrame from "../utils/dataframe"
import CoordinateComponents from "../components/polar/index"

const _ = Canvax._;

export default class Polar extends CoordinateBase
{
    constructor( node, data, opts, graphsMap, componentsMap )
    {
        super( node, data, opts );

        this.graphsMap = graphsMap;
        this.componentsMap = componentsMap;

        var me = this;

        //坐标系统
        this._coordinate = null;
        this.coordinate = {
            rAxis : {
                field : []
            }
        };

        _.extend(true, this, opts);

        //强制把graphs设置为数组
        this.graphs = _.flatten( [ this.graphs ] );

        //根据graphs.field 来 配置 this.coordinate.rAxis.field -------------------
        if( !_.isArray( this.coordinate.rAxis.field ) ){
            this.coordinate.rAxis.field = [this.coordinate.rAxis.field ];
        };
        if( opts.graphs ){
            //有graphs的就要用找到这个graphs.field来设置coordinate.rAxis
            var arrs = [];
            _.each( this.graphs, function( graphs ){
                if( graphs.field ){
                    //没有配置field的话就不绘制这个 graphs了
                    var _fs = graphs.field;
                    if( !_.isArray( _fs ) ){
                        _fs = [ _fs ];
                    };
                    arrs = arrs.concat( _fs );
                };
            } );
        };
        this.coordinate.rAxis.field = this.coordinate.rAxis.field.concat( arrs );
        //----------------------------------------------------------------------

        //这里不要直接用data，而要用 this._data
        this.dataFrame = this.initData( this._data );
    }

    initModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new CoordinateComponents( this.coordinate, this );
        this.coordinateSprite.addChild( this._coordinate.sprite );

        _.each( this.graphs , function( graphs ){
            var _g = new me.graphsMap[ graphs.type ]( graphs, me );
            me._graphs.push( _g );
            me.graphsSprite.addChild( _g.sprite );
        } );
    }

    startDraw(opt)
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

        this.bindEvent();
    }

    _getLegendData()
    {
        var legendData = [
            //{name: "uv", style: "#ff8533", enabled: true, ind: 0}
        ];
        _.each( this._graphs, function( _g ){
            _.each( _g.getLegendData(), function( item ){
                
                if( _.find( legendData , function( d ){
                    return d.name == item.name
                } ) ) return;

                legendData.push({
                    name    : item.name,
                    color   : item.fillStyle,
                    enabled : item.enabled,
                    ind     : item.ind
                })
            } );
        } );
        return legendData;
    }

    //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
    //方便外部自定义tip是的content
    setTipsInfo(e)
    {
        e.eventInfo = this._coordinate.getTipsInfoHandler(e);

        //如果具体的e事件对象中有设置好了得e.eventInfo.nodes，那么就不再遍历_graphs去取值
        if( !e.eventInfo.nodes || !e.eventInfo.nodes.length ){
            var nodes = [];
            var iNode = e.eventInfo.aAxis.ind;
            _.each( this._graphs, function( _g ){
                nodes = nodes.concat( _g.getNodesAt( iNode ) );
            } );
            e.eventInfo.nodes = nodes;
        };
        e.eventInfo.rowData = this.dataFrame.getRowData( iNode );
    }

    _tipsPointerShow( e, _tips, _coor )
    {
        
    }

    _tipsPointerHide( e, _tips, _coor )
    {

    }

    _tipsPointerMove( e, _tips, _coor )
    {
        
    }
};