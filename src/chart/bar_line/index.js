import Canvax from "canvax2d"
import Bar from "../bar/index"
import Graphs from "../bar/graphs"
import Line from "../line/index"
import LineGraphs from "../line/graphs"
import Tips from "../line/tips"
import {colors as themeColors} from "../theme"
import Coordinate from "../../components/descartes/index"

const _ = Canvax._;

export default class Bar_Line extends Bar
{
    constructor( node, data, opts )
    {
        super( node, data, opts ); 
        this.type = "bar_line"
    }

    _init(node, data, opts)
    {
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

        //附加折线部分
        this._lineChart = {
            _graphs: null
        };
    }

    draw( opt )
    {
        !opt && (opt ={});
        this.setStages(opt);
        if (this.rotate) {
            this._rotate(this.rotate);
        };
        this._initBarModule( opt ); //初始化模块  
        this.initComponents( opt ); //初始化组件
        this._startDraw( opt ); //开始绘图
        this.drawComponents( opt );  //绘图完，开始绘制插件
        this.drawLineGraphs( opt ); //开始绘制折线图的graphs
        this.inited = true;
    }

    _initBarModule(opt) 
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new Coordinate( this.coordinate, this );
        this.core.addChild( this._coordinate.sprite );

        this._graphs = new Graphs(this.graphs, this);
        this._graphs._yAxis = [ this._coordinate._yAxis[0] ];
        this.core.addChild(this._graphs.sprite);

        this._tips = new Tips(this.tips, this.canvax.domView);
        this.stageTip.addChild(this._tips.sprite);

    }

    _reset(opt , e )
    {
        var me = this;
        opt = !opt ? this : opt;
        me._removeChecked();
        this._coordinate.reset( opt.coordinate, this.dataFrame );
        this._graphs.reset( opt.graphs );
        this._lineChart._graphs.reset( opt.graphs , this.dataFrame);
        this.componentsReset( opt , e );
    }

    //绘制line部分
    drawLineGraphs( opt )
    {
        //从主题色里面获取除开bar占据的几个颜色之外的颜色给到折线
        var barFLen = _.flatten( [this.coordinate.yAxis[0]] ).length;
        var themeColor = themeColors;
        themeColor.slice( barFLen);
        this._lineChart._graphs = new LineGraphs(
            _.extend(true, {
                fill : {
                    alpha: 0
                },
                line : {
                    strokeStyle : themeColor
                } 
            } , this.graphs )
            , 
            this
        );

        this._lineChart._graphs._yAxis = this._coordinate._yAxisRight;
        //附加的lineChart._graphs 添加到core
        this.core.addChild(this._lineChart._graphs.sprite);

        //绘制折线图主图形区域
        this._lineChart._graphs.draw({
            x: this._coordinate.graphsX,
            y: this._coordinate.graphsY,
            w: this._coordinate.graphsWidth,
            h: this._coordinate.graphsHeight,
            smooth: this.smooth,
            inited: this.inited,
            resize: opt.resize
        });
        this._lineChart._graphs.sprite.getChildById("induce").context.visible = false;
        //绘制完grapsh后，要把induce 给到 _tips.induce
        this._tips.setInduce( this._lineChart._graphs.induce );
    }

    _setTipsInfoHand(e)
    {
        this._setXaxisYaxisToTipsInfo(e);
        this._getLineTipInfo(e);
    }

    //获取折线部分的tip info信息
    _getLineTipInfo(e)
    {
        //横向分组索引
        var iNode = e.target.iNode;
        var _nodesInfoList = []; //节点信息集合
        var groups = this._lineChart._graphs.groups;
        if (!e.eventInfo) {
            return;
        };
        if( e.target.iGroup!==-1 || e.target.iLay!==-1 ){
            //选中了单个的bar， 那么就不需要显示折线图tip的line
            e.eventInfo.markcolumn = {
                enabled : false
            }
            return;
        };
        e.eventInfo.markcolumn = {
            enabled : true
        };
        
        for (var a = 0, al = groups.length; a < al; a++) {
            var o = groups[a].getNodeInfoAt(iNode);
            if (o) {
                _nodesInfoList.push(o);
            }
        };
     
        e.eventInfo.nodesInfoList = e.eventInfo.nodesInfoList.concat(_nodesInfoList);
        e.eventInfo.tipsLine = {
            x: this._coordinate._xAxis.sprite.localToGlobal({
                x: this._coordinate._xAxis.data[iNode].x,
                y: 0
            }).x
        }
    }

}