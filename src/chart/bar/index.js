import Chart from "../descartes"
import Canvax from "canvax2d"

import {numAddSymbol} from "../../utils/tools"
import Coordinate from "../../components/descartes/index"
import Graphs from "./graphs"
import Tips from "../../components/tips/index"

const _ = Canvax._;

export default class Bar extends Chart
{
    constructor( node, data, opts )
    {
        super( node, data, opts );
        this.type = "bar";
        
        //如果需要绘制百分比的柱状图
        if (opts.graphs && opts.graphs.proportion) {
            this._initProportion(node, data, opts);
        } else {
            _.extend( true, this, opts);
        };

        this.dataFrame = this.initData(data);

        //一些继承自该类的 constructor 会拥有_init来做一些覆盖，比如横向柱状图,柱折混合图...
        this._init && this._init(node, data, opts);
        this.draw();
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
        
        this._tips = new Tips(this.tips, this.canvax.domView);
        
        this.stageTip.addChild(this._tips.sprite);
    }

    //比例柱状图
    _initProportion(node, data, opts) 
    {
        !opts.tips && (opts.tips = {});

        opts.tips = _.extend(true, {
            content: function(info) {
                
                var str = "<table style='border:none'>";
                var self = this;
                _.each(info.nodesInfoList, function(node, i) {
                    str += "<tr style='color:" + (node.color || node.fillStyle) + "'>";
                   
                    var tsStyle="style='border:none;white-space:nowrap;word-wrap:normal;'";
                
                    str += "<td "+tsStyle+">" + node.field + "：</td>";
                    str += "<td "+tsStyle+">" + numAddSymbol(node.value);
                    if( node.vCount ){
                        str += "（" + Math.round(node.value / node.vCount * 100) + "%）";
                    };

                    str +="</td></tr>";
                });
                str += "</table>";
                return str;
            }
        } , opts.tips );

        _.extend(true, this, opts);
        _.each( _.flatten( [this.coordinate.yAxis] ) ,function( yAxis ){
            _.extend(true, yAxis, {
                dataSection: [0, 20, 40, 60, 80, 100],
                text: {
                    format: function(n) {
                        return n + "%"
                    }
                }
            });
        });
       
        !this.graphs && (this.graphs = {});
        _.extend(true, this.graphs, {
            bar: {
                radius: 0
            }
        });
    }

}