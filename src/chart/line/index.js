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
        this.dataFrame = this.initData(data);

        //一些继承自该类的 constructor 会拥有_init来做一些覆盖，暂时没有场景，先和bar保持一致
        this._init && this._init(node, data, opts);
        this.draw();
    }

    _initModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new Coordinate( this.coordinate, this );
        this.core.addChild( this._coordinate.sprite );

        this._graphs = new Graphs(this.graphs, this);
        this.core.addChild(this._graphs.sprite);

        this._tips = new Tips(this.tips, this.canvax.domView, this.dataFrame);
        this._tips._markColumn.on("mouseover" , function(e){
            me._setXaxisYaxisToTipsInfo(e);
            me._tips.show( e );
        });
        
        this.stageTip.addChild(this._tips.sprite);
        
    }

    _startDraw(opt)
    {
        var me = this;

        //初始化一些在开始绘制的时候就要处理的plug，这些plug可能会影响到布局，比如legend，datazoom

        this._coordinate.draw( opt );

        this._graphs.draw({
            x: this._coordinate.graphsX,
            y: this._coordinate.graphsY,
            w: this._coordinate.graphsWidth,
            h: this._coordinate.graphsHeight,
            smooth: this.smooth,
            inited: this.inited,
            resize: opt.resize
        }).on("complete" , function(){
            me.fire("complete");
        });

        //绘制完grapsh后，要把induce 给到 _tipss.induce
        this._tips.setInduce( this._graphs.induce );

        var me = this;
        this.bindEvent();
        this._tips.sprite.on('nodeclick', function(e) {
            me._setXaxisYaxisToTipsInfo(e);
            me.fire("nodeclick", e.eventInfo);
        });
        
    }



    //datazoom begin
    getDataZoomChartOpt()
    {   
        var opt = {
            graphs: {
                line: {
                    lineWidth: 1,
                    strokeStyle: "#ececec"
                },
                node: {
                    enabled: false
                },
                fill: {
                    alpha: 0.5,
                    fillStyle: "#ececec"
                },
                animation: false,
                eventEnabled: false,
                text: {
                    enabled: false
                }
            }
        }
        return opt;
    }
    //datazoom end


    //markpoint begin
    drawMarkPoint(e)
    {

    }
    //markpoint end


    drawAnchor( _anchor )
    {
        var pos = {
            x : this._coordinate._xAxis.layoutData[ this.anchor.xIndex ].x,
            y : this._coordinate.graphsHeight + this._graphs.data[ this._coordinate._yAxis[0].field[0] ].groupData[ this.anchor.xIndex ].y
        };
        _anchor.aim( pos );
    }

    
    bindEvent( _setXaxisYaxisToTipsInfo )
    {
    
        var me = this;
        _setXaxisYaxisToTipsInfo || (_setXaxisYaxisToTipsInfo = me._setXaxisYaxisToTipsInfo);
        this.core.on("panstart mouseover", function(e) {
            if ( me._tips.enabled ) {
                _setXaxisYaxisToTipsInfo.apply(me, [e]);
                me._tips.show(e);
            };
            me.fire(e.type, e);
        });
        this.core.on("panmove mousemove", function(e) {
            if ( me._tips.enabled ) {
                _setXaxisYaxisToTipsInfo.apply(me, [e]);
                me._tips.move(e);
                me.fire(e.type, e);
            }
        });
        this.core.on("panend mouseout", function(e) {
            /*
            if (e.toTarget && ( e.toTarget.name == '_markcolumn_node' || e.toTarget.name == '_markcolumn_line')) {
                return
            };
            */
            if (me._tips.enabled) {
                me._tips.hide(e);
            }
        });
        this.core.on("tap", function(e) {
            if (me._tips.enabled) {
                me._tips.hide(e);
                _setXaxisYaxisToTipsInfo.apply(me, [e]);
                me._tips.show(e);
            }
        });
        this.core.on("click", function(e) {
            _setXaxisYaxisToTipsInfo.apply(me, [e]);
            me.fire("click", e.eventInfo);
        });
    }

    //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
    //方便外部自定义tip是的content
    _setXaxisYaxisToTipsInfo(e)
    {

        if (!e.eventInfo) {
            return;
        };

        e.eventInfo.xAxis = this._coordinate._xAxis.layoutData[ e.eventInfo.iNode ]; 
        e.eventInfo.xAxis && (e.eventInfo.title = e.eventInfo.xAxis.layoutText);
        e.eventInfo.dataZoom = this.dataZoom;
        e.eventInfo.rowData = this.dataFrame.getRowData( e.eventInfo.iNode );
    }
    
    createMarkColumn( xVal , opt)
    {
        return this._graphs.createMarkColumn( this._coordinate.getPosX( {val : xVal} ) , _.extend(opt,{xVal: xVal}));
    }

    moveMarkColumnTo( mcl , xval , opt )
    {
        var x = this._coordinate.getPosX( {val : xval} );
        return mcl.move( {
            eventInfo: this._graphs.getNodesInfoOfx( x )
        } , {
            x: x,
            xVal: xval
        });
    }
}