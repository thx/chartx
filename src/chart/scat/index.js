import Chart from "../descartes"
import Canvax from "canvax2d"

import Coordinate from "../../components/descartes/index"
import Graphs from "./graphs"
import Tips from "../../components/tips/index"

const _ = Canvax._;

export default class Scat extends Chart 
{
    constructor(node , data , opts)
    {
        super(node , data , opts)
        this.type = "scat";


        //坐标系统
        this.coordinate.xAxis.layoutType = "proportion";

        _.extend(true, this, opts);
        this.dataFrame = this.initData(data);

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
        
        this._tips = new Tips(this.tips, this.canvax.domView);
        this.stageTips.addChild(this._tips.sprite);
    }
    

    showLabel()
    {
        this._graphs._textsp.context.visible = true;
    }

    hideLabel()
    {
        this._graphs._textsp.context.visible = false;
    }


}
