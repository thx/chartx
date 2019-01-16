/*
* 太阳图
*/
import Canvax from "canvax"
import GraphsBase from "../index"
import sankeyLayout from "../../../layout/sankey/index"
import { _,event,getDefaultProps } from "mmvis"

const Path = Canvax.Shapes.Path;
const Rect = Canvax.Shapes.Rect;

export default class sankeyGraphs extends GraphsBase
{
    static defaultProps(){
        return {
            keyField: {
                detail: 'key字段',
                default: null
            },
            valueField: {
                detail: 'value字段',
                default: 'value'
            },
            parentField: {
                detail: 'parent字段',
                default: null
            },
            node : {
                detail: 'node',
                propertys: {
                    width: {
                        detail: '节点宽',
                        default: 18
                    },
                    padding: {
                        detail: '节点间距',
                        default: 10
                    },
                    fillStyle: {
                        detail: '节点背景色',
                        default: null
                    }
                }
            },
            line: {
                detail: '线设置',
                propertys: {
                    strokeStyle: {
                        detail: '线颜色',
                        default: 'blue'
                    },
                    alpha: {
                        detail: '线透明度',
                        default: 0.3
                    }
                }
            },
            label: {
                detail: '文本设置',
                propertys: {
                    fontColor: {
                        detail: '文本颜色',
                        default: '#666666'
                    },
                    fontSize: {
                        detail: '文本字体大小',
                        default: 12
                    },
                    textAlign: {
                        detail: '水平对齐方式',
                        default: 'left'
                    },
                    verticalAlign: {
                        detail: '垂直对齐方式',
                        default: 'middle'
                    }
                }
            }
        }
    }
    constructor(opt, app)
    {
        super( opt, app );
        this.type = "sankey";

        _.extend( true, this, getDefaultProps( sankeyGraphs.defaultProps() ), opt );

        this.init( );
    }

    init()
    {
        this._links = new Canvax.Display.Sprite();
        this._nodes = new Canvax.Display.Sprite();
        this._labels = new Canvax.Display.Sprite();

        this.sprite.addChild(this._links);
        this.sprite.addChild(this._nodes);
        this.sprite.addChild(this._labels);
    }


    draw( opt )
    {
        
        !opt && (opt ={});
        _.extend( true, this , opt );

        this.data = this._trimGraphs();

        this._widget();
        
        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        this.fire("complete");
    }

    _trimGraphs(){

        var me = this;
        var nodes = [];
        var links = [];
        var keyDatas = me.dataFrame.getFieldData( me.keyField );
        var valueDatas = me.dataFrame.getFieldData( me.valueField );
        var parentFields = me.dataFrame.getFieldData( me.parentField );

        var nodeMap = {}; //name:ind
        _.each( keyDatas, function( key, i ){
            var nodeNames = [];
            if( me.parentField ){
                nodeNames.push( parentFields[i] );
            };
            nodeNames = nodeNames.concat( key.split(/[,|]/) );

            _.each( nodeNames, function( name ){
                if( nodeMap[ name ] === undefined ){
                    nodeMap[ name ] = nodes.length;
                    nodes.push( {
                        name : name
                    } );
                }
            } );
        } );


        _.each( keyDatas, function( key , i ){
            //var nodeNames = key.split(/[,|]/);
            var nodeNames = [];
            if( me.parentField ){
                nodeNames.push( parentFields[i] );
            };
            nodeNames = nodeNames.concat( key.split(/[,|]/) );

            if( nodeNames.length == 2 ){
                links.push({
                    source : nodeMap[ nodeNames[0] ],
                    target : nodeMap[ nodeNames[1] ],
                    value  : valueDatas[i] 
                })
            }
        } );

        return sankeyLayout()
            .nodeWidth( this.node.width )
            .nodePadding( this.node.padding )
            .size([this.width, this.height])
            .nodes(nodes)
            .links(links)
            .layout(16);
 
    }

    _widget(){
        this._drawNodes();
        this._drawLinks();
        this._drawLabels();
    }

    _getColor( style, node, ind ){
        var me = this;
        var color = style;
        if( _.isArray( color ) ){
            color = color[ ind ];
        }
        if( _.isFunction( color ) ){
            color = color( node );
        }
        if( !color ){
            color = me.app.getTheme( ind );
        }
        return color;
    }

    _drawNodes() {
        
        var nodes = this.data.nodes();
        var me = this;
        _.each(nodes, function(node, i) {
           
            var nodeColor = me._getColor( me.node.fillStyle, node, i );
            var nodeEl = new Rect({
                xyToInt:false,
                context: {
                    x: node.x,
                    y: node.y,
                    width: me.data.nodeWidth(),
                    height: Math.max(node.dy , 1),
                    fillStyle: nodeColor
                }
            });
            nodeEl.data = node;

            me._nodes.addChild(nodeEl);
        });
    }

    _drawLinks(){
        var links = this.data.links();
        var me = this;
        _.each(links, function(link, i) {
            var linkColor = me._getColor( me.line.strokeStyle, link , i);
            var d = me.data.link()(link);
        
            var _path = new Path({
                xyToInt : false,
                context: {
                    path: d,
                    fillStyle: linkColor,
                    //lineWidth: Math.max(1, link.dy),
                    globalAlpha: me.line.alpha,
                    cursor:"pointer"
                }
            });


            _path.link = link;

            _path.on( event.types.get(), function(e) {
                
                if( e.type == 'mouseover' ){
                    this.context.globalAlpha += 0.2;
                };
                if( e.type == 'mouseout' ){
                    this.context.globalAlpha -= 0.2;
                };

                var linkData = this.link;

                e.eventInfo = {
                    trigger : me.node,
                    title : linkData.source.name+" --<span style='position:relative;top:-0.5px;font-size:16px;left:-3px;'>></span> "+linkData.target.name,
                    nodes : [ linkData ]
                };
    
                //fire到root上面去的是为了让root去处理tips
                me.app.fire( e.type, e );
             });


            me._links.addChild( _path );
        });
    }

    _drawLabels(){
        
        var nodes = this.data.nodes();
        var me = this;
        _.each(nodes, function(node){
            var textAlign = me.label.textAlign;

            var x = node.x+me.data.nodeWidth()+4;
            /*
            if( x > me.width/2 ){
                x  = node.x - 4;
                textAlign = 'right';
            } else {
                x += 4;
            };
            */
            var y = node.y+Math.max(node.dy / 2 , 1);

            var label = new Canvax.Display.Text(node.name , {
                context: {
                    x : x,
                    y : y,
                    fillStyle    : me.label.fontColor,
                    fontSize     : me.label.fontSize,
                    textAlign    : textAlign,
                    textBaseline : me.label.verticalAlign
                }
            });
            me._labels.addChild( label );

            if( label.getTextWidth()+x > me.width ){
                label.context.x = node.x - 4;
                label.context.textAlign = 'right';
            };

        });
    }



}