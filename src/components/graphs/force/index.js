import Canvax from "canvax"
import GraphsBase from "../index"
//import * as force from "../../../layout/force/index";
import * as force from 'd3-force'
import { getDefaultProps } from "../../../utils/tools"

let {_,event} = Canvax;
let Circle = Canvax.Shapes.Circle;
let Text = Canvax.Display.Text;
let Line = Canvax.Shapes.Line;


class Force extends GraphsBase {
    static defaultProps() {
        return {
            keyField: {
                detail: 'key字段',
                default: ''
            },
            field: {
                detail: 'value字段，node，link都公用这个字段',
                default: ''
            },
            node: {
                detail: '单个节点的配置',
                propertys: {
                    shapeType: {
                        detail: '节点图形',
                        default: 'circle'
                    },
                    radiusMin: {
                        detail: '最小节点半径',
                        default: 6
                    },
                    radiusMax: {
                        detail: '最大节点半径',
                        default: 30
                    },
                    radius: {
                        detail: '节点半径',
                        default: null
                    },
                    fillStyle: {
                        detail: '节点背景色',
                        default: '#acdf7d'
                    },
                    strokeStyle: {
                        detail: '描边颜色',
                        default: '#e5e5e5'
                    },
                    lineWidth: {
                        detail: '描边线宽',
                        default: 0
                    },
                    nodeAlpha: {
                        detail: '节点透明度',
                        default: 1
                    },
                    strength: {
                        detail: '节点之间作用力',
                        default: -300
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
                    lineAlpha: {
                        detail: '连线透明度',
                        default: 0.6
                    },
                    distanceMin: {
                        detail: '最小连线距离',
                        default: 30
                    },
                    distanceMax: {
                        detail: '最大连线距离',
                        default: 200
                    },
                    distance: {
                        detail: '连线距离',
                        default: null
                    },
                    arrow: {
                        detail: '是否有箭头',
                        default:true
                    }
                }
            },
            label: {
                detail: '节点内容配置',
                propertys: {
                    field: {
                        detail: '内容字段',
                        default: 'label'
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
    }

    static polyfill( opt ){
        if( opt.valueField ){ 
            //20220304 所有的graph都统一一个field
            opt.field = opt.valueField;
            delete opt.valueField;
        }
        return opt
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
                //{ type,key,label,ctype,width,height,x,y }
            ],
            edges: [
                //{ type,key[],label,ctype,width,height,x,y }
            ],
            size: {
                width: this.app.width,
                height: this.app.height
            }
        };

        let _nodeMap = {};
        let nodeValMin=0,nodeValMax=0,lineValMin=0,lineValMax=0;
        for (let i = 0; i < this.dataFrame.length; i++) {
            let rowData = this.dataFrame.getRowDataAt(i);
            let fields = _.flatten([(rowData[this.keyField] + "").split(",")]);
            let label  = this._getContent(rowData);
            let key = fields.length == 1 ? fields[0] : fields;
            
            let value = rowData[ this.field ];
            

            let element = new Canvax.Display.Sprite({
                id: "nodeSp_"+key
            });
            this.graphsSp.addChild( element );

            let node = {
                type: "force",
                field: this.field,
                iNode: i,
                rowData: rowData,
                key: key,
                value: value,
                label: label,

                //下面三个属性在_setElementAndSize中设置
                element:element, //外面传的layout数据可能没有element，widget的时候要检测下
                width  : null,
                height : null,

                //radius : 1,    //默认为1
                //distance: 20,  //如果是

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
                if( value != undefined ){
                    nodeValMin = Math.min( nodeValMin, value );
                    nodeValMax = Math.max( nodeValMax, value );
                }
            } else {
                node.shapeType = "line";
                data.edges.push(node);
                if( value != undefined ){
                    lineValMin = Math.min( lineValMin, value );
                    lineValMax = Math.max( lineValMax, value );
                }
            };
        };

        this.nodeValMin = nodeValMin;
        this.nodeValMax = nodeValMax;
        this.lineValMin = lineValMin;
        this.lineValMax = lineValMax;

        data.nodes.forEach( node => {
            //计算 node的 半径 width height 和 style等
            node.radius = this.node.radius ? this.getProp( this.node.radius, node ) : this._getNodeRadius( node );
            node.width  = node.height = node.radius*2;

        });

        data.edges.forEach( edge => {
            let keys      = edge.key;
            edge.source   = _nodeMap[ keys[0] ];
            edge.target   = _nodeMap[ keys[1] ];

            edge.distance = this.line.distance ? this.getProp( this.node.distance, edge ) : this._getLineDistance( edge );
            
        });

        return data;
    }

    //this.node.radius为null的时候 内部默认的计算radius的方法
    _getNodeRadius( nodeData ){
        let val = nodeData.value;
        let radius = this.node.radiusMin;
        if( val ){
            radius += (( this.node.radiusMax - this.node.radiusMin )/( this.nodeValMax-this.nodeValMin )) * val;
        }
        return parseInt(radius)
    }
    //this.line.distance 为null的时候 内部默认的计算 distance 的方法
    _getLineDistance( nodeData ){
        let val = nodeData.value;
        let distance = this.line.distanceMin;
        if( val ){
            distance += (( this.line.distanceMax - this.line.distanceMin )/( this.lineValMax-this.lineValMin )) * val;
        }
        return parseInt(distance);
    }

    widget() {
        let me = this;

        let keyField   = this.keyField;
        let field = this.field;
        let links = this.data.edges.map(d => {
            //source: "Napoleon", target: "Myriel", value: 1
            return {
                source: d.source[ keyField ], 
                target: d.target[ keyField ], 
                value: d.rowData[ field ],
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
            .force("link", force.forceLink( links ).id(d => d.id).distance( ( edge, edgeIndex, edges) => {
                let distance = edge.nodeData.distance;
                let distanceNodes = edge.source.nodeData.radius + edge.target.nodeData.radius;
                return Math.max(distance, distanceNodes);
            } ))
            .force("charge", force.forceManyBody()
            .distanceMin( this.line.distanceMin )
            .distanceMax( this.line.distanceMax )
            .strength( this.node.strength )) //节点间作用力
            .force("center", force.forceCenter(width / 2, height / 2))
            .force('collide',force.forceCollide().radius(( node, nodeIndex, nodes ) => {
                return node.nodeData.radius;
            }))
            .force("x", force.forceX())
            .force("y", force.forceY())
            .alpha(0.5)

        nodes.forEach(node => {

            let fillStyle   = me.getProp(me.node.fillStyle   , node.nodeData);
            let strokeStyle = me.getProp(me.node.strokeStyle , node.nodeData);
            let lineWidth   = me.getProp(me.node.lineWidth   , node.nodeData);
            let nodeAlpha   = me.getProp(me.node.nodeAlpha   , node.nodeData);

            //写回nodeData里面，tips等地方需要
            node.nodeData.fillStyle = fillStyle;

            let r           = node.nodeData.radius;
            let _node = new Circle({
                context: {
                    r,
                    fillStyle,
                    strokeStyle,
                    lineWidth,
                    globalAlpha: nodeAlpha,
                    cursor: 'pointer'
                }
            });
            node.nodeData.element.addChild( _node );

            _node.nodeData = node.nodeData;
            _node.on(event.types.get(), function(e) {
                e.eventInfo = {
                    trigger : me.node,
                    nodes   : [ this.nodeData ]
                };
                me.app.fire( e.type, e );
            });

            let labelFontSize     = me.getProp( me.label.fontSize , node.nodeData);
            let labelFontColor    = me.getProp( me.label.fontColor , node.nodeData);
            let labelTextBaseline = me.getProp( me.label.textBaseline , node.nodeData);
            let labelTextAlign    = me.getProp( me.label.textAlign , node.nodeData);

            
            let _label = new Text( node.nodeData.label, {
                context: {
                    fontSize     : labelFontSize,
                    fillStyle    : labelFontColor,
                    textBaseline : labelTextBaseline,
                    textAlign    : labelTextAlign,
                    globalAlpha  : 0.7
                }
            } );
            node.nodeData.element.addChild( _label );
            
        });

        links.forEach( link => {
            let lineWidth   = me.getProp( me.line.lineWidth, link.nodeData );
            let strokeStyle = me.getProp( me.line.strokeStyle, link.nodeData );
            let lineType    = me.getProp( me.line.lineType, link.nodeData );
            let lineAlpha   = me.getProp( me.line.lineAlpha, link.nodeData );

            link.nodeData.strokeStyle = strokeStyle;

            let _line = new Line({
                context: {
                    lineWidth,strokeStyle,lineType,
                    start : {
                        x:0,y:0
                    },
                    end: {
                        x:0,y:0
                    },
                    globalAlpha: lineAlpha
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

        let _c; //this.label;
        if (this._isField(this.label.field)) {
            _c = rowData[ this.label.field ];
        };
        if (me.label.format) {
            if(  _.isFunction(me.label.format) ){
                _c = me.label.format.apply(this, [ _c, rowData ]);
            }
        } else {
            //否则用fieldConfig上面的
            let _coord = me.app.getComponent({name:'coord'});
            let fieldConfig = _coord.getFieldConfig( me.keyField );
            if(fieldConfig ){
                _c = fieldConfig.getFormatValue( _c );
            };
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