import Canvax from "canvax"
import GraphsBase from "../index"
import * as force from "../../../layout/force/index";
import { getDefaultProps } from "../../../utils/tools"

let _ = Canvax._
let Circle = Canvax.Shapes.Circle;
let Text = Canvax.Display.Text;
let Line = Canvax.Shapes.Line;


class Force extends GraphsBase {
    static defaultProps() {
        return {
            keyField: {
                detail: 'key字段',
                default: 'key'
            },
            valueField: {
                detail: 'value字段',
                default: 'value'
            },
            node: {
                detail: '单个节点的配置',
                propertys: {
                    shapeType: {
                        detail: '节点图形',
                        default: 'circle'
                    },
                    maxWidth: {
                        detail: '节点最大的width',
                        default: 200
                    },
                    width: {
                        detail: '内容的width',
                        default: null
                    },
                    height: {
                        detail: '内容的height',
                        default: null
                    },
                    radius: {
                        detail: '圆角角度',
                        default: 6
                    },
                    fillStyle: {
                        detail: '节点背景色',
                        default: '#acdf7d'
                    },
                    strokeStyle: {
                        detail: '描边颜色',
                        default: '#e5e5e5'
                    },
                    padding: {
                        detail: 'node节点容器到内容的边距',
                        default: 10
                    },
                    content: {
                        detail: '节点内容配置',
                        propertys: {
                            field: {
                                detail: '内容字段',
                                documentation: '默认content字段',
                                default: 'content'
                            },
                            fontColor: {
                                detail: '内容文本颜色',
                                default: '#666'
                            },
                            format: {
                                detail: '内容格式化处理函数',
                                default: null
                            },
                            textAlign: {
                                detail: "textAlign",
                                default: "center"
                            },
                            textBaseline: {
                                detail: 'textBaseline',
                                default: "middle"
                            }
                        }
                    }
                }
            },
            line: {
                detail: '两个节点连线配置',
                propertys: {
                    lineWidth: {
                        detail: '线宽',
                        default: 1
                    },
                    strokeStyle: {
                        detail: '连线的颜色',
                        default: '#e5e5e5'
                    },
                    lineType: {
                        detail: '连线样式（虚线等）',
                        default: 'solid'
                    },
                    arrow: {
                        detail: '是否有箭头',
                        default:true
                    }
                }
            },

            status: {
                detail: '一些开关配置',
                propertys: {
                    transform: {
                        detail: "是否启动拖拽缩放整个画布",
                        propertys: {
                            fitView: {
                                detail: "自动缩放",
                                default: ''     //autoZoom
                            },
                            enabled: {
                                detail: "是否开启",
                                default: true
                            },
                            scale: {
                                detail: "缩放值",
                                default: 1
                            },
                            scaleOrigin: {
                                detail: "缩放原点",
                                default: {
                                    x: 0, y: 0
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    constructor(opt, app) {
        super(opt, app);
        this.type = "force";

        _.extend(true, this, getDefaultProps(Force.defaultProps()), opt);

        this.init();
    }

    init() {

        this.nodesSp = new Canvax.Display.Sprite({
            id: "nodesSp"
        });
        this.edgesSp = new Canvax.Display.Sprite({
            id: "edgesSp"
        });
        this.graphsSp = new Canvax.Display.Sprite({
            id: "graphsSp"
        });
        this.graphsSp.addChild(this.edgesSp);
        this.graphsSp.addChild(this.nodesSp);

        this.sprite.addChild(this.graphsSp);
    }

    draw( opt ) {
        !opt && (opt = {});
        _.extend(true, this, opt);
        this.data = opt.data || this._initData();

        this.widget();
    }

    _initData() {
        //和关系图那边保持data格式的统一
        let data = {
            nodes: [
                //{ type,key,content,ctype,width,height,x,y }
            ],
            edges: [
                //{ type,key[],content,ctype,width,height,x,y }
            ],
            size: {
                width: this.app.width,
                height: this.app.height
            }
        };

        let _nodeMap = {};
        for (let i = 0; i < this.dataFrame.length; i++) {
            let rowData = this.dataFrame.getRowDataAt(i);
            let fields = _.flatten([(rowData[this.keyField] + "").split(",")]);
            let content = this._getContent(rowData);
            let key = fields.length == 1 ? fields[0] : fields;
            let element = new Canvax.Display.Sprite({
                id: "nodeSp_"+key
            });
            this.graphsSp.addChild( element );

            let node = {
                type: "force",
                iNode: i,
                rowData: rowData,
                key: key,
                content: content,
                ctype: this._checkHtml(content) ? 'html' : 'canvas',

                //下面三个属性在_setElementAndSize中设置
                element:element, //外面传的layout数据可能没有element，widget的时候要检测下
                width  : null,
                height : null,
                radius : 1, //默认为1

                //这个在layout的时候设置
                x: null,
                y: null,
                shapeType: null,

                //如果是edge，要填写这两节点
                source : null,
                target : null
            };

            //_.extend(node, this._getElementAndSize(node));

            if (fields.length == 1) {
                node.shapeType = this.getProp( this.node.shapeType, node );
                data.nodes.push(node);
                _nodeMap[ node.key ] = node;
            } else {
                node.shapeType = "line";
                data.edges.push(node);
            };
        };

        //然后给edge填写source 和 target
        _.each( data.edges, function( edge ){
            let keys = edge.key;
            edge.source = _nodeMap[ keys[0] ];
            edge.target = _nodeMap[ keys[1] ];
        } );

        return data;
    }

    widget() {
        let me = this;

        let keyField = this.keyField;
        let valField = this.valueField;
        let links = this.data.edges.map(d => {
            //source: "Napoleon", target: "Myriel", value: 1
            return {
                source: d.source[ keyField ], 
                target: d.target[ keyField ], 
                value: d.rowData[ valField ],
                nodeData : d
            }
        });
        
        let nodes = this.data.nodes.map(d => {
            let node = Object.create(d)
            node.id = d.key;
            node.nodeData = d;
            return node
        });
      
        let { width,height } = this.data.size;

        const simulation = force.forceSimulation( nodes )
            .force("link", force.forceLink( links ).id(d => d.id))
            .force("charge", force.forceManyBody())
            .force("center", force.forceCenter(width / 2, height / 2))
            .force("x", force.forceX( width/2 ).strength(0.045))
            .force("y", force.forceY( height/2 ).strength(0.045))

        nodes.forEach(node => {

            let fillStyle = me.getProp(me.node.fillStyle, node.nodeData);
            let strokeStyle = me.getProp(me.node.strokeStyle, node.nodeData);
            //let radius = _.flatten([me.getProp(me.node.radius, node)]);
            let _node = new Circle({
                context: {
                    r : 8,
                    fillStyle, strokeStyle
                }
            });
            node.nodeData.element.addChild( _node );

            let _label = new Text( node.nodeData.rowData.label, {
                context: {
                    fontSize: 11,
                    fillStyle: "#bfa08b",
                    textBaseline: "middle",
                    textAlign: "center",
                    globalAlpha: 0.7
                }
            } );
            node.nodeData.element.addChild( _label );
            
        });

        links.forEach( link => {
            let lineWidth = me.getProp( me.line.lineWidth, link.nodeData );
            let strokeStyle = me.getProp( me.line.strokeStyle, link.nodeData );

            let _line = new Line({
                context: {
                    lineWidth,strokeStyle,
                    start : {
                        x:0,y:0
                    },
                    end: {
                        x:0,y:0
                    },
                    globalAlpha: 0.4
                }
            })
            this.edgesSp.addChild(_line);

            link.line = _line;
        });

        simulation.on("tick",()=>{
            if( simulation.alpha() <= 0.05 ){
                simulation.stop();
                return;
            };
            nodes.forEach(node => {
                let elemCtx = node.nodeData.element.context;
                if( elemCtx ){
                    elemCtx.x = node.x;
                    elemCtx.y = node.y;
                };
            });
            links.forEach(link => {
                let lineCtx = link.line.context;
                if( lineCtx ){
                    lineCtx.start.x = link.source.x;
                    lineCtx.start.y = link.source.y;
                    lineCtx.end.x = link.target.x;
                    lineCtx.end.y = link.target.y;
                }
            });
            
        });

        

    }
     
    /**
     * 字符串是否含有html标签的检测
     */
    _checkHtml(str) {
        let reg = /<[^>]+>/g;
        return reg.test(str);
    }
    _getContent(rowData) {
        let me = this;

        let _c; //this.node.content;
        if (this._isField(this.node.content.field)) {
            _c = rowData[ this.node.content.field ];
        };
        if (me.node.content.format && _.isFunction(me.node.content.format)) {
            _c = me.node.content.format.apply(this, [ _c, rowData ]);
        };
        return _c;
    }
    _isField(str) {
        return ~this.dataFrame.fields.indexOf(str)
    }

    getNodesAt() {

    }

    getProp( prop, nodeData ) {
        let _prop = prop;
        if( this._isField( prop ) && nodeData.rowData ){
            _prop = nodeData.rowData[ prop ];
        } else {
            if( _.isArray( prop ) ){
                _prop = prop[ nodeData.iNode ]
            };
            if( _.isFunction( prop ) ){
                _prop = prop.apply( this, [ nodeData ] );
            };
        };
        return _prop;
    }

}

GraphsBase.registerComponent(Force, 'graphs', 'force');

export default Force