import Canvax from "canvax"
import {numAddSymbol} from "../../../utils/tools"
import GraphsBase from "../index"
import { _, event, getDefaultProps } from "mmvis"


export default class Progress extends GraphsBase
{

    static defaultProps = {
        node : {
            detail : '横向翻转坐标系',
            documentation : "横向翻转坐标系",
            default       : false,
            values        : [true, false]
        }
    }

    constructor(opt, app)
    {
        super(opt, app);

        this.type = "progress";

        _.extend( true, this, getDefaultProps( new.target.defaultProps ) );
        
        this.init();
    }

    init(){

    }

    draw(opt)
    {
        !opt && (opt ={});
        
        var me = this;
        _.extend(true, this, opt);

        //this.data = this._trimGraphs();
        //this._widget();

        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;
debugger
        this.fire("complete");
    }

}