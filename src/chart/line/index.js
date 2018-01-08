import Chart from "../descartes"
import Canvax from "canvax2d"
import Graphs from "./graphs"

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

}