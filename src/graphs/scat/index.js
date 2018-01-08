import Canvax from "canvax2d"
import {colors as themeColors} from "../../theme"

const Circle = Canvax.Shapes.Circle;
const Rect = Canvax.Shapes.Rect;
const _ = Canvax._;

export default class Graphs extends Canvax.Event.EventDispatcher
{
    constructor(opt, root)
    {
        super( opt, root );

        //这里所有的opt都要透传给 group
        this.opt = opt || {};
        this.root = root;
        this.ctx = root.stage.context2D;
        
        this.data = []; //二维 [[{x:0,y:-100,...},{}],[]] ,所有的grapsh里面的data都存储的是layout数据
        this.groupsData = []; //节点分组 { groupName: '', list: [] } 对上面数据的分组

        this.width = 0;
        this.height = 0;
        this.pos = {
            x: 0,
            y: 0
        };

        this.node = {
            shapeType   : "circle", //节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现
            maxR    : 20,  //圆圈默认最大半径
            minR    : 5,
            r       : null,
            normalR : 10,
            fillStyle : null,
            strokeStyle : null,
            lineWidth : 0,
            alpha : 0.9
        };
        this.label = {
            field : null,
            format : function(label){ return label },
            fontSize: 12,
            fontColor: "#777"
        };

        this.animation = true;

        this.field = null;

        this.groupField = null; //如果有多个分组的数据，按照这个字段分组，比如男女

        this.colors  = themeColors;

        this.sprite   = null;

        _.extend( true, this , opt );

        this.init( );

    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "graphsEl"
        });

        this._shapesp = new Canvax.Display.Sprite({ 
            id : "shapesp"
        });
        this._textsp = new Canvax.Display.Sprite({ 
            id : "textsp"
        });
        this.sprite.addChild( this._shapesp );
        this.sprite.addChild( this._textsp )
    }

    draw(opt)
    {
        _.extend( true, this , opt );
        this.data = this._trimGraphs(); //groupsData也被自动设置完成
        
        this._widget();

        this.sprite.context.x = this.pos.x;
        this.sprite.context.y = this.pos.y;

        if( this.animation ){
            this.grow();
        };

        return this;
    }

    getNodesAt()
    {
        return []
    }

    _trimGraphs()
    {
        var tmplData = [];

        var dataLen  = this.root.dataFrame.org.length - 1; //减去title fields行
        var xField = this.root._coordinate._xAxis.field;

        for( var i=0; i<dataLen; i++ ){
            
            var rowData = this.root.dataFrame.getRowData(i);
            var xValue = rowData[ xField ];
            var yValue = rowData[ this.field ];
            var xPos = this.root._coordinate._xAxis.getPosX({ val : xValue });
            var yPos = this.root._coordinate._getYaxisOfField( this.field ).getYposFromVal( yValue );
            var group = this.getGroup( rowData );
            var groupInd = this.getGroupInd( rowData );

            var nodeLayoutData = {
                rowData : rowData,
                groupInd : groupInd,
                pos : {
                    x: xPos,
                    y: yPos   
                },
                value : {
                    x: xValue,
                    y: yValue
                },
                field : this.field,
                groupName : rowData[ this.groupField ] || "",

                //下面的属性都单独设置
                r : null,   //这里先不设置，在下面的_setR里单独设置
                fillStyle : null,
                strokeStyle : null,
                lineWidth : 0,
                shapeType : null,
                shape : null, //对应的canvax 节点， 在widget之后赋值
                label : null
            };

            this._setR( nodeLayoutData );
            this._setFillStyle( nodeLayoutData );
            this._setStrokeStyle( nodeLayoutData );
            this._setLineWidth( nodeLayoutData );
            this._setNodeType( nodeLayoutData );
            this._setLabel( nodeLayoutData );

            group.list.push( nodeLayoutData );
            tmplData.push( nodeLayoutData );

        };

        return tmplData;
    }

    _setR( nodeLayoutData )
    {

        var r = this.node.normalR;
        var rowData = nodeLayoutData.rowData;
        if( this.node.r != null ){
            if( _.isString( this.node.r ) && rowData[ this.node.r ] ){
                //如果配置了某个字段作为r，那么就要自动计算比例
                if( !this._rData && !this._rMaxValue && !this._rMinValue ){
                    this._rData = this.root.dataFrame.getFieldData( this.node.r );
                    this._rMaxValue = _.max( this._rData );
                    this._rMinValue = _.min( this._rData );
                };
                var rVal = rowData[ this.node.r ];
                r = this.node.minR + (rVal-this._rMinValue)/( this._rMaxValue-this._rMinValue ) * ( this.node.maxR - this.node.minR )

            };
            if( _.isFunction( this.node.r ) ){
                r = this.node.r( rowData );
            };
            if( !isNaN( parseInt( this.node.r ) ) ){
                r = parseInt( this.node.r )
            };
        };
        nodeLayoutData.r = r;
        return this;

    }

    _setLabel( nodeLayoutData )
    {
        if( this.label.field != null ){
            if( _.isString( this.label.field ) && nodeLayoutData.rowData[ this.label.field ] ){
                nodeLayoutData.label = nodeLayoutData.rowData[ this.label.field ]
            }
        }
    }

    _setFillStyle( nodeLayoutData )
    {
        nodeLayoutData.fillStyle = this._getStyle( this.node.fillStyle, nodeLayoutData );
        return this;
    }

    _setStrokeStyle( nodeLayoutData )
    {
        nodeLayoutData.strokeStyle = this._getStyle( this.node.strokeStyle, nodeLayoutData );
        return this;
    }

    _getStyle( style, nodeLayoutData )
    {
        var _style = style;
        if( _.isArray( style ) ){
            _style = style[ nodeLayoutData.groupInd ]
        };
        if( _.isFunction( style ) ){
            _style = style( nodeLayoutData );
        };
        if( !_style ){
            _style = this.colors[ nodeLayoutData.groupInd ]
        };
        return _style;
    }

    _setLineWidth( nodeLayoutData )
    {
        nodeLayoutData.lineWidth = this.node.lineWidth;
        return this;
    }

    _setNodeType( nodeLayoutData )
    {
        var shapeType = this.node.shapeType;
        if( _.isArray( shapeType ) ){
            shapeType = shapeType[ nodeLayoutData.groupInd ]
        };
        if( _.isFunction( shapeType ) ){
            shapeType = shapeType( nodeLayoutData );
        };
        if( !shapeType ){
            shapeType = "circle"
        };
        nodeLayoutData.shapeType = shapeType;
        return this;
    }

    getGroup( rowData )
    {
        var group;
        var me = this;
        if( this.groupField ){
            //如果有设置分组字段
            group = _.find( this.groupsData, function( group ){
                return group.groupName == rowData[ me.groupField ]
            });
            if( !group ){
                group = {
                    groupName: rowData[ this.groupField ],
                    list: []
                };
                this.groupsData.push( group );
            }
        } else {
            if( this.groupsData.length==0 ){
                group = {
                    groupName: "",
                    list : []
                }
                this.groupsData.push( group );
            } else {
                group = this.groupsData[0];
            }
        }
        return group;
    }

    //必须要先执行了getGroup
    getGroupInd( rowData )
    {
        var i=0;
        var me = this;
        _.each( this.groupsData, function( group, gi ){
            if( group.groupName == rowData[ me.groupField ] ){
                i = gi
            }
        } );
        return i;
    }

    //根据layoutdata开始绘制
    _widget()
    {
        var me = this;
        _.each( this.groupsData, function( group, iGroup ){
            var groupSprite = new Canvax.Display.Sprite({ id : group.groupName });
            me._shapesp.addChild( groupSprite );

            _.each( group.list , function( nodeData, iNode ){

                var _context = me._getNodeContext( nodeData );
                var Shape = nodeData.shapeType == "circle" ? Circle : Rect;

                var _node = new Shape({
                    id: "shape_"+iGroup+"_"+iNode,
                    context : _context
                });
                groupSprite.addChild( _node );

                //数据和canvax原件相互引用
                _node.nodeData = nodeData;
                _node.iNode = iNode;
                nodeData.shape = _node;

                _node.on("panstart mouseover", function(e) {
                    e.eventInfo = me._getEventInfo(e , this.nodeData, this.iNode);
                })
                _node.on("panmove mousemove", function(e) {
                    e.eventInfo = me._getEventInfo(e , this.nodeData, this.iNode);
                })
                _node.on("panend mouseout", function(e) {
                    e.eventInfo = me._getEventInfo(e , this.nodeData, this.iNode);
                    me.iGroup = 0, me.iNode = -1
                })
                _node.on("tap click", function(e) {
                    e.eventInfo = me._getEventInfo(e , this.nodeData, this.iNode);
                })

                //如果有label
                if( nodeData.label ){
                    var _label = nodeData.label
                    text =  new Canvax.Display.Text( _label , {
                        id: "text_"+iGroup+"_"+iNode,
                        context: me._getLabelContext( nodeData )
                    });
            
                    me._textsp.addChild(text);

                    //图形节点和text文本相互引用
                    _node.label = text;
                    text.shape = _node;
                }
            
            } );
        } );
    }

    _getLabelContext( nodeData )
    {
        var ctx = {
            x: nodeData.pos.x,
            y: nodeData.pos.y,
            fillStyle: this.label.fontColor,
            fontSize: this.label.fontSize,
            textAlign : 'center',
            textBaseline : 'middle'
        };
        if( this.animation ){
            ctx.x = 0;
            ctx.y = 0;
        };
        return ctx;
    }

    _getNodeContext( nodeData )
    {
        if( nodeData.shapeType == "circle" ){
            return this._getCircleContext( nodeData );
        }
    }

    _getCircleContext( nodeData )
    {
        var ctx = {
            x : nodeData.pos.x,
            y : nodeData.pos.y,
            r : nodeData.r,
            fillStyle : nodeData.fillStyle,
            strokeStyle : nodeData.strokeStyle,
            lineWidth : nodeData.lineWidth,
            globalAlpha : this.node.alpha
        }
        if( this.animation ){
            ctx.x = 0;
            ctx.y = 0;
            ctx.r = 1;
        };
        return ctx;
    }

    _getEventInfo( e , nodeData, iNode )
    {
        var info = {
            iGroup: nodeData.groupInd,
            iNode: iNode,
            nodesInfoList: [ nodeData ]
        };
        return info;
    }

    /**
     * 生长动画
     */
    grow()
    {
        _.each( this.data , function( nodeData ){
            nodeData.shape.animate({
                x : nodeData.pos.x,
                y : nodeData.pos.y,
                r : nodeData.r
            }, {
                onUpdate: function( opt ){
                    if( this.label ){
                        this.label.context.x = opt.x;
                        this.label.context.y = opt.y;
                    }
                },
                delay : Math.round(Math.random()*300)
            })
        } );
    }
}
