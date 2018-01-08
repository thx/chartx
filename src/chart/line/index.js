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
        this.coordinateSprite.addChild( this._coordinate.sprite );

        _.each( this.graphs , function( graphs ){
            var _g = new Graphs( graphs, me );
            me._graphs.push( _g );
            me.graphsSprite.addChild( _g.sprite );
        } );

        this._tips = new Tips(this.tips, this.canvax.domView, this.dataFrame, this._coordinate);
        this.stageTips.addChild(this._tips.sprite);
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