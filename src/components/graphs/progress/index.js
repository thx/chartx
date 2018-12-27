import Canvax from "canvax"
import {numAddSymbol} from "../../../utils/tools"
import GraphsBase from "../index"
import { _, event, getDefaultProps } from "mmvis"


export default class Progress extends GraphsBase
{

    static defaultProps = {
        node : {
            detail : '进度条设置',
            propertys : {
                width : {
                    detail: '进度条的宽度',
                    default : 20
                },
                radius : {
                    detail : '进度条两端的圆角半径',
                    default : 10, //默认为width的一半
                }
            }
        },
        allAngle : {
            detail : '总角度',
            documentation: '默认为null，则和坐标系同步',
            default : null
        },
        startAngle : {
            detail : '其实角度',
            documentation: '默认为null，则和坐标系同步',
            default : null
        }
    }

    constructor(opt, app)
    {
        super(opt, app);

        this.type = "progress";

        _.extend( true, this, getDefaultProps( new.target.defaultProps ), opt );
        
        this.init();
    }

    init(){

    }

    draw(opt)
    {
        !opt && (opt ={});
        
        var me = this;
        _.extend(true, this, opt);

        this.data = this._trimGraphs();
        //this._widget();

        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        this.fire("complete");
    }

    _trimGraphs()
    {
        var me = this;

        var _coord = this.app.getComponent({name:'coord'});

        //用来计算下面的hLen
        this.enabledField = _coord.filterEnabledFields( this.field );
        
        var data = {}
        _.each( this.enabledField, function( field ){
            var dataOrg = me.dataFrame.getFieldData(field);
            var fieldMap = _coord.getFieldMapOf( field );
            var arr = [];

            var startAngle = me.startAngle || _coord.startAngle;
            var allAngle = me.allAngle || _coord.allAngle;
            var endAngle = startAngle + allAngle;

            var startRadian = Math.PI * startAngle / 180; //起始弧度
            var endRadian = Math.PI * endAngle / 180; //终点弧度

            debugger
            var outRadius= _coord.radius;
            var innerRadius = outRadius - me.node.width;


            var startOutPoint = _coord.getPointInRadianOfR( startRadian, outRadius );
            var endOutPoint = _coord.getPointInRadianOfR( endRadian, outRadius );
            var startInnerPoint = _coord.getPointInRadianOfR( startRadian, innerRadius );
            var endInnerPoint = _coord.getPointInRadianOfR( endRadian, innerRadius );

            var large_arc_flag = 0;
            if( allAngle > 180 ){
                large_arc_flag = 1;
            };
            
            var pathStr = "M"+startOutPoint.x+" "+startOutPoint.y;
            pathStr += "A"+outRadius+" "+outRadius+" 0 "+large_arc_flag+" 1 " + endOutPoint.x + " "+ endOutPoint.y;
            pathStr += "L"+endInnerPoint.x+" "+endInnerPoint.y;
            pathStr += "A"+innerRadius+" "+innerRadius+" 0 "+large_arc_flag+" 0 " + startInnerPoint.x + " "+ startInnerPoint.y;
            pathStr += "Z"

            var pathElement = new Canvax.Shapes.Path({
                context : {
                    path : pathStr,
                    fillStyle : "blue"
                }
            });

            me.sprite.addChild( pathElement );

            var center = new Canvax.Shapes.Circle({
                context : {
                    r : 5,
                    fillStyle : "red"
                }
            });
            me.sprite.addChild( center );

            /*
            _.each( _coord.aAxis.angleList , function( _a , i ){
                //弧度
                var _r = Math.PI * _a / 180;
                var point = _coord.getPointInRadianOfR( _r, _coord.getROfNum(dataOrg[i]) );
                arr.push( {
                    field   : field,
                    iNode   : i,
                    rowData : me.dataFrame.getRowDataAt(i),
                    focused : false,
                    value   : dataOrg[i],
                    point   : point,
                    color   : fieldMap.color
                } );
            } );
            */
            data[ field ] = arr;
        } );
        return data;
    }


}