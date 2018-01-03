import Chart from "../descartes"
import Canvax from "canvax2d"
import Coordinate from "../../components/descartes/index"
import Graphs from "./graphs"
import Tips from "./tips"

const _ = Canvax._;

export default class Line extends Chart
{
    constructor( node, data, opts )
    {
        super( node, data, opts );
        this.type = "line";
        this.coordinate.xAxis.layoutType = "rule";

        _.extend(true, this, opts);

        //这里不要直接用data，而要用 this._data
        this.dataFrame = this.initData( this._data );

        //一些继承自该类的 constructor 会拥有_init来做一些覆盖，暂时没有场景，先和bar保持一致
        this._init && this._init(node, this._data, this._opts);
        this.draw();
    }

    _initModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new Coordinate( this.coordinate, this );
        this.core.addChild( this._coordinate.sprite );

        _.each( this.graphs , function( graphs ){
            var _g = new Graphs( graphs, me );
            me._graphs.push( _g );
            me.graphsSprite.addChild( _g.sprite );
        } );
        this.core.addChild(this.graphsSprite);

        this._tips = new Tips(this.tips, this.canvax.domView, this.dataFrame, this._coordinate);
        
        this.stageTip.addChild(this._tips.sprite);
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
                width: _coor.graphsWidth,
                height: _coor.graphsHeight,
                pos: {
                    x: _coor.graphsX,
                    y: _coor.graphsY
                },
                sort: _coor._yAxis.sort,
                inited: me.inited,
                resize: opt.resize
            });
        } );

        this.bindEvent();
    }

    drawAnchor( _anchor )
    {
        var pos = {
            x : this._coordinate._xAxis.layoutData[ this.anchor.xIndex ].x,
            y : this._coordinate.graphsHeight + this._graphs.data[ this._coordinate._yAxis[0].field[0] ].groupData[ this.anchor.xIndex ].y
        };
        _anchor.aim( pos );
    }
}