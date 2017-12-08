import Canvax from "canvax2d"

const _ = Canvax._;
const Line = Canvax.Shapes.Line;
const Circle = Canvax.Shapes.Circle;

export default class markColumn extends Canvax.Event.EventDispatcher
{
    constructor( opt , data )
    {
        super();

        this.xVal      = null;
        this.enabled   = true;
        this.line      = {
            enabled      : 1,
            eventEnabled : true
             //strokeStyle : null
        };
        this.node      = {
            enabled : 1
            //strokeStyle : null
            //backFillStyle : null
        }

        this.sprite    = null;
        this._line     = null;
        this._nodes    = null;
        this._isShow   = false;
        this.enabled   = true;

        this.y         = 0;
        this.h         = 0;

        //TODO:
        //暂时继承CanvaxEventDispatcher 只有 DisplayObject才行， 以为其他对象没有_eventMap
        //临时加上
        this._eventMap = {};

        this.init(opt , data);
    }

    init(opt , data)
    {
        _.extend(true, this , opt);
        this.sprite = new Canvax.Display.Sprite({
            id : "tips"
        });
    }

    show(e , pointInfo)
    {
        this.eventInfo = e.eventInfo;

        if( e.eventInfo.markcolumn ){
            _.extend(true, this , e.eventInfo.markcolumn);
        };
        if( !this.enabled ){
            this.hide();
            return this;
        };
        this.sprite.context.visible = true;
        this._showLine(pointInfo);
        this._showNodes(e , pointInfo);
        return this;
    }

    hide()
    {
        this.sprite.context.visible = false;
    }

    move( e , pointInfo )
    {
        this.eventInfo = e.eventInfo;

        if(this._line){
            this._line.context.x  = parseInt(pointInfo.x);
        };
        if( pointInfo.xVal !== undefined ){
            this.xVal = pointInfo.xVal;
        };
        this._resetNodesStatus(e , pointInfo);
    }

    destroy()
    {
        this.sprite.destroy();
        this._line  = null;
        this._nodes = null;
    }
    /**
     * line相关------------------------
     */
    _showLine(pointInfo)
    {
        var me = this;
        var lineOpt = _.extend(true, {
            x       : parseInt(pointInfo.x),
            y       : me.y,
            start : {
                x : 0,
                y : me.h,
            },
            end : {
                x: 0,
                y: 0
            },
            lineWidth   : 1,
            strokeStyle : this.line.strokeStyle || "#cccccc" 
        } , this.line);
        if(this.line.enabled){
            if( this._line ){
                _.extend( this._line.context , lineOpt );
            } else {
                this._line = new Line({
                    id : "tipsLine",
                    context : lineOpt
                });
                this._line.name = "_markcolumn_line";
                this.sprite.addChild( this._line );

                if( this.line.eventEnabled ){
                    this._line.on("mouseover", function(evt) {
                        if( evt.fromTarget && evt.fromTarget.name == "_markcolumn_node" ){
                            return;
                        };
                        evt.eventInfo = me.eventInfo;
                        if( me.xVal !== null ){
                            evt.eventInfo.xAxis = {value : me.xVal};
                        };
                        me.fire("mouseover" , evt);
                    });
                    this._line.on("mousemove", function(evt) {
                        evt.eventInfo = me.eventInfo;
                        if( me.xVal !== null ){
                            evt.eventInfo.xAxis = {value : me.xVal};
                        };
                        me.fire("mousemove" , evt);
                    });
                    this._line.on("mouseout", function(evt) {
                        if( evt.toTarget && evt.toTarget.name == "_markcolumn_node" ){
                            return;
                        }
                        evt.eventInfo = me.eventInfo;
                        if( me.xVal !== null ){
                            evt.eventInfo.xAxis = {value : me.xVal};
                        };
                        me.fire("mouseout" , evt);
                    });
                }
                
            }
        }
        return this;
    }


    /**
     *nodes相关-------------------------
     */
    _showNodes(e , pointInfo)
    {

        var me = this;
        if( !this.node.enabled ){
            return;
        };
        if( this._nodes ){
            this._resetNodesStatus( e , pointInfo );
        } else {
            this._nodes = new Canvax.Display.Sprite({
                context : {
                    x   : parseInt(pointInfo.x),
                    y   : me.y
                }
            });
            var me = this;

            _.each( e.eventInfo.nodesInfoList , function( node ){
                var csp = new Canvax.Display.Sprite({
                    context : {
                        y : me.h - Math.abs(node.y)
                    }
                });
                
                var bigCircle = new Circle({
                    context : {
                        r : node.r + 2,
                        fillStyle   : me.node.backFillStyle || "white",//node.fillStyle,
                        strokeStyle : me.node.strokeStyle || node.strokeStyle,
                        lineWidth   : node.lineWidth,
                        cursor      : 'pointer'
                    }
                });

                bigCircle.name = '_markcolumn_node', 
                bigCircle.eventInfo = {
                    iGroup: 0,//node._groupInd,
                    iNode : e.eventInfo.iNode,
                    nodesInfoList : [node]
                };

                csp.addChild(bigCircle);

                me._nodes.addChild( csp );

                bigCircle.on("mouseover", function(evt) {
                    if( evt.fromTarget && (evt.fromTarget.name == "_markcolumn_line" || evt.fromTarget.name == "_markcolumn_node" )){
                        return;
                    }
                    evt.eventInfo = evt.target.eventInfo;
                    
                    if( me.xVal !== null ){
                        evt.eventInfo.xAxis = {value : me.xVal};
                    };
                    me.fire("mouseover" , evt);
                });
                bigCircle.on("mousemove", function(evt) {
                    evt.eventInfo = evt.target.eventInfo;
                    if( me.xVal !== null ){
                        evt.eventInfo.xAxis = {value : me.xVal};
                    };
                    me.fire("mousemove" , evt);
                });
                bigCircle.on("mouseout", function(evt) {
                    if( evt.toTarge && (evt.toTarget.name == "_markcolumn_line" || evt.toTarget.name == "_markcolumn_node" )){
                        return;
                    }
                    evt.eventInfo = evt.target.eventInfo;
                    if( me.xVal !== null ){
                        evt.eventInfo.xAxis = {value : me.xVal};
                    };
                    me.fire("mouseout" , evt);
                });
                bigCircle.on("click", function(evt) {
                    // evt.target.eventInfo.nodeInfo = evt.target.eventInfo.nodesInfoList[0]
                    // var eventInfo = _.clone(evt.target.eventInfo)
                    // delete eventInfo.nodesInfoList
                    var o = {
                        eventInfo : _.clone(evt.target.eventInfo)
                    };
                    if( me.xVal !== null ){
                        o.eventInfo.xAxis = {value : me.xVal};
                    };
                    me.sprite.fire("nodeclick", o);
                });

            } );
            this.sprite.addChild( this._nodes );
        }

        return this;
    }

    /**
    * 重置nodes的状态
    */
    _resetNodesStatus(e , pointInfo)
    {
        if( !this.enabled || !this.node.enabled ){
            return;
        }
        var me = this;
        if( this._nodes.children.length != e.eventInfo.nodesInfoList.length ){
            this._nodes.removeAllChildren();
            this._nodes = null;
            this._showNodes( e , pointInfo );
        };
        this._nodes.context.x = parseInt(pointInfo.x);
        _.each( e.eventInfo.nodesInfoList , function( node , i ){
            var csps         = me._nodes.getChildAt(i).context;
            csps.y           = me.h - Math.abs(node.y);

            var bigCircle = me._nodes.getChildAt(i).getChildAt(0)
            bigCircle.eventInfo = {
                iGroup: 0,//node._groupInd,
                iNode : e.eventInfo.iNode,
                nodesInfoList : [node]
            }
        });
    }
}