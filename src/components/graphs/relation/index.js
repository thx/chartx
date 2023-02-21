import Canvax from "canvax"
import GraphsBase from "../index"
import global from "../../../global"
import dataFrame from "../../../core/dataFrame"
import {getDefaultProps} from "../../../utils/tools"
import { checkDataIsJson, jsonToArrayForRelation, arrayToTreeJsonForRelation } from './data'
import Zoom from "../../../utils/zoom"
//import Dagre from "../../../layout/dagre/index"
import Dagre from "dagre"

let { _, event } = Canvax;
let Rect    = Canvax.Shapes.Rect;
let Diamond = Canvax.Shapes.Diamond;
let Path    = Canvax.Shapes.Path;
let BrokenLine = Canvax.Shapes.BrokenLine;
let Circle  = Canvax.Shapes.Circle;
let Arrow   = Canvax.Shapes.Arrow;

 
/**
 * 关系图中 包括了  配置，数据，和布局数据，
 * 默认用配置和数据可以完成绘图， 但是如果有布局数据，就绘图玩额外调用一次绘图，把布局数据传入修正布局效果
 */
class Relation extends GraphsBase {
    static defaultProps() {
        return {
            field: {
                detail: 'key字段设置',
                documentation: '',
                default: null
            },
            childrenField: {
                detail: '树结构数据的关联字段',
                documentation: '如果是树结构的关联数据，不是行列式，那么就通过这个字段来建立父子关系',
                default: 'children'
            },
            
            //rankdir: "TB",
            //align: "DR",
            //nodesep: 0,//同级node之间的距离
            //edgesep: 0,
            //ranksep: 0, //排与排之间的距离
            rankdir:{
                detail : '布局方向',
                default: null
            },

            node: {
                detail: '单个节点的配置',
                propertys: {
                    shapeType: {
                        detail: '节点图形，支持rect,diamond',
                        default: 'rect'
                    },
                    maxWidth: {
                        detail: '节点最大的width',
                        default: 200
                    },
                    cursor: {
                        detail: '节点的鼠标样式',
                        default: 'pointer'
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
                        detail: '圆角角度，对rect生效',
                        default: 6
                    },
                    includedAngle: {
                        detail: 'shapeType为diamond(菱形)的时候生效,x方向的夹角',
                        default: 60
                    },
                    fillStyle: {
                        detail: '节点背景色',
                        default: '#ffffff'
                    },
                    lineWidth: {
                        detail: '描边宽度',
                        default: 1
                    },
                    strokeStyle: {
                        detail: '描边颜色',
                        default: '#e5e5e5'
                    },
                    shadow: {
                        detail: '阴影设置',
                        propertys: {
                            shadowOffsetX: {
                                detail: 'x偏移量',
                                default: 0
                            },
                            shadowOffsetY: {
                                detail: 'y偏移量',
                                default: 0
                            },
                            shadowBlur: {
                                detail: '阴影模糊值',
                                default: 0
                            },
                            shadowColor: {
                                detail: '阴影颜色',
                                default: '#000000'
                            }
                        }
                    },
                    select: {
                        detail: '选中效果',
                        propertys: {
                            enabled: {
                                detail: '是否开启选中',
                                default: false
                            },
                            list: {
                                detail: '选中的node.key的集合,外部传入可以选中',
                                default: []
                            },
                            triggerEventType: {
                                detail: '触发事件',
                                default:'click,tap'
                            },
                            shadow: {
                                detail: '选中效果的阴影设置',
                                propertys: {
                                    shadowOffsetX: {
                                        detail: 'x偏移量',
                                        default: 0
                                    },
                                    shadowOffsetY: {
                                        detail: 'y偏移量',
                                        default: 0
                                    },
                                    shadowBlur: {
                                        detail: '阴影模糊值',
                                        default: 0
                                    },
                                    shadowColor: {
                                        detail: '阴影颜色',
                                        default: '#000000'
                                    }
                                }
                            },
                            fillStyle: {
                                detail: 'hover节点背景色',
                                default: '#ffffff'
                            },
                            lineWidth: {
                                detail: 'hover描边宽度',
                                default: 1
                            },
                            strokeStyle: {
                                detail: 'hover描边颜色',
                                default: '#e5e5e5'
                            },
                            onbefore: {
                                detail: '执行select处理函数的前处理函数，返回false则取消执行select',
                                default: null
                            },
                            onend: {
                                detail: '执行select处理函数的后处理函数',
                                default: null
                            }
                        }
                    },
                    focus: {
                        detail: 'hover效果',
                        propertys: {
                            enabled: {
                                detail: '是否开启hover效果',
                                default: false
                            },
                            shadow: {
                                detail: '选中效果的阴影设置',
                                propertys: {
                                    shadowOffsetX: {
                                        detail: 'x偏移量',
                                        default: 0
                                    },
                                    shadowOffsetY: {
                                        detail: 'y偏移量',
                                        default: 0
                                    },
                                    shadowBlur: {
                                        detail: '阴影模糊值',
                                        default: 0
                                    },
                                    shadowColor: {
                                        detail: '阴影颜色',
                                        default: '#000000'
                                    }
                                }
                            },
                            fillStyle: {
                                detail: 'hover节点背景色',
                                default: '#ffffff'
                            },
                            lineWidth: {
                                detail: 'hover描边宽度',
                                default: 1
                            },
                            strokeStyle: {
                                detail: 'hover描边颜色',
                                default: '#e5e5e5'
                            }
                        }
                    },

                    padding: {
                        detail: 'node节点容器到内容的边距,节点内容是canvas的时候生效，dom节点不生效',
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
                            },
                            init: {
                                detail: '内容节点的初始化完成回调',
                                documentation: '在节点内容配置为需要异步完成的时候，比如节点内容配置为一个magix的view',
                                default: null
                            }
                        }
                    }
                    
                }
            },
            line: {
                detail: '两个节点连线配置',
                propertys: {
                    isTree: {
                        detail: '是否树结构的连线',
                        documentation: '非树结构启用该配置可能会有意想不到的惊喜，慎用',
                        default: false
                    },
                    inflectionRadius: {
                        detail: '树状连线的拐点圆角半径',
                        default: 0
                    },
                    shapeType: {
                        detail: '连线的图形样式 brokenLine or bezier',
                        default: 'bezier'
                    },
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
                        detail: '连线箭头配置',
                        propertys: {
                            enabled: {
                                detail  :'是否开启arrow设置',
                                default : true
                            },
                            offsetX: {
                                detail  :'x方向偏移',
                                default : 0
                            },
                            offsetY: {
                                detail  : 'y方向偏移',
                                default : 0
                            }
                        }
                    },
                    edgeLabel: {
                        detail: '连线上面的label配置',
                        propertys: {
                            enabled: {
                                detail: '是否开启label设置',
                                default: true
                            },
                            fontColor: {
                                detail: '文本颜色',
                                default: '#ccc'
                            },
                            fontSize: {
                                detail: '文本大小',
                                default: 12
                            },
                            // offsetX: {
                            //     detail: 'x方向偏移量',
                            //     default:0
                            // },
                            // offsetY: {
                            //     detail: 'y方向偏移量',
                            //     default:0
                            // },
                            offset: {
                                detail: 'label的位置，函数，参数是整个edge对象',
                                default: null
                            }
                        }
                    },
                    icon: {
                        detail: '连线上面的操作icon',
                        propertys: {
                            enabled: {
                                detail: '是否开启线上的icon设置',
                                default: false
                            },
                            charCode: {
                                detail: 'iconfont上面对应的unicode中&#x后面的字符',
                                default: null
                            },
                            lineWidth: {
                                detail: 'icon描边线宽',
                                default: 1
                            },
                            strokeStyle: {
                                detail: 'icon的描边颜色',
                                default: '#e5e5e5'
                            },
                            fontColor: {
                                detail: 'icon的颜色',
                                default: '#e5e5e5'
                            },
                            fontFamily: {
                                detail: 'font-face的font-family设置',
                                default: 'iconfont'
                            },
                            fontSize : {
                                detail: 'icon的字体大小',
                                default: 14
                            },
                            offset: {
                                detail: 'icon的位置，函数，参数是整个edge对象',
                                default: null
                            },
                            offsetX: {
                                detail: '在计算出offset后的X再次便宜量',
                                default: 1
                            },
                            offsetY: {
                                detail: '在计算出offset后的Y再次便宜量',
                                default: 2
                            },
                            background:{
                                detail: 'icon的背景颜色，背景为圆形',
                                default: "#fff"
                            }
                        }
                    },
                    cursor: 'default'
                }
            },
            layout: {
                detail: '采用的布局引擎,比如dagre',
                default: "dagre"
            },
            layoutOpts: {
                detail: '布局引擎对应的配置,dagre详见dagre的官方wiki',
                propertys: {
                    
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
                            },
                            wheelAction: {
                                detail: "滚轮触屏滑动触发的行为，可选有scale和offset，默认offset",
                                default: "offset"
                            }
                        }
                    }
                }
            }
        }
    }

    constructor(opt, app) {
        super(opt, app);
        this.type = "relation";

        _.extend(true, this, getDefaultProps(Relation.defaultProps()), opt);
        
        if (this.layout === 'dagre') {
            let dagreOpts = {
                graph: {
                    rankdir: 'TB',
                    nodesep: 10,
                    ranksep: 10,
                    edgesep: 10,
                    acyclicer: "greedy"
                },
                node: {

                },
                edge: {
                    labelpos: 'c',
                    //labeloffset: 0
                }
            };
            _.extend(true, dagreOpts, this.layoutOpts);
            _.extend(true, this.layoutOpts, dagreOpts);

            if( !this.rankdir ){
                this.rankdir = this.layoutOpts.graph.rankdir
            } else {
                //如果有设置this.randdir 则已经 ta 为准
                this.layoutOpts.graph.rankdir = this.rankdir;
            };
            
        };

        this.domContainer = app.canvax.domView;
        this.induce = null;

        this.init();
    }

    init() {
        this._initInduce();

        this.nodesSp = new Canvax.Display.Sprite({
            id: "nodesSp"
        });
        this.nodesContentSp = new Canvax.Display.Sprite({
            id: "nodesContentSp"
        });
        this.edgesSp = new Canvax.Display.Sprite({
            id: "edgesSp"
        });
        this.arrowsSp = new Canvax.Display.Sprite({
            id: "arrowsSp"
        });
        this.labelsSp = new Canvax.Display.Sprite({
            id: "labelsSp"
        });

        this.graphsSp = new Canvax.Display.Sprite({
            id: "graphsSp"
        });

        //这个view和induce是一一对应的，在induce上面执行拖拽和滚轮缩放，操作的目标元素就是graphsView
        this.graphsView = new Canvax.Display.Sprite({
            id: "graphsView"
        });

        this.graphsSp.addChild(this.edgesSp);
        this.graphsSp.addChild(this.nodesSp);
        this.graphsSp.addChild(this.nodesContentSp);
        this.graphsSp.addChild(this.arrowsSp);
        this.graphsSp.addChild(this.labelsSp);

        this.graphsView.addChild(this.graphsSp);
        this.sprite.addChild(this.graphsView);

        this.zoom = new Zoom();

    }

    _initInduce() {
        let me = this;
        this.induce = new Rect({
            id: "induce",
            context: {
                width: 0,
                height: 0,
                fillStyle: "#000000",
                globalAlpha: 0
            }
        });
        this.sprite.addChild( this.induce );

        let _mosedownIng = false;
        let _preCursor = me.app.canvax.domView ? "default" : me.app.canvax.domView.style.cursor;

        //滚轮缩放相关
        let _wheelHandleTimeLen = 32; //16*2
        let _wheelHandleTimeer = null;
        let _deltaY = 0;

        this.induce.on( event.types.get(), function (e) {

            if (me.status.transform.enabled) {
                e.preventDefault();
                let point = e.target.localToGlobal(e.point, me.sprite);

                //鼠标拖拽移动
                if (e.type == "mousedown") {
                    me.induce.toFront();
                    _mosedownIng = true;
                    me.app.canvax.domView && (me.app.canvax.domView.style.cursor = "move");
                    me.zoom.mouseMoveTo( point );
                };
                if (e.type == "mouseup" || e.type == "mouseout") {
                    me.induce.toBack();
                    _mosedownIng = false;
                    me.app.canvax.domView && (me.app.canvax.domView.style.cursor = _preCursor);
                };
                if (e.type == "mousemove") {
                    if ( _mosedownIng ) {
                        let {x,y} = me.zoom.move( point );
                        me.graphsView.context.x = parseInt(x);
                        me.graphsView.context.y = parseInt(y);
                    }
                };

                //滚轮缩放
                if (e.type == "wheel") {
                    console.log( _deltaY, e.deltaY )
                    if (Math.abs(e.deltaY) > Math.abs(_deltaY)) {
                        _deltaY = e.deltaY;
                    };
                    if (!_wheelHandleTimeer) {
                        _wheelHandleTimeer = setTimeout(function () {
 
                            if( me.status.transform.wheelAction == 'offset' ){
                                //移动的话用offset,偏移多少像素
                                let {x,y} = me.zoom.offset( {x:-e.deltaX, y:-e.deltaY} ); //me.zoom.move( {x:zx, y:zy} );
                                me.graphsView.context.x = x;
                                me.graphsView.context.y = y;
                            } 
                            if( me.status.transform.wheelAction == 'scale' ){
                                // 缩放         
                                let {scale,x,y} = me.zoom.wheel( e, point );
                                me.graphsView.context.x = x;
                                me.graphsView.context.y = y;
                                me.graphsView.context.scaleX = scale;
                                me.graphsView.context.scaleY = scale;
                                me.status.transform.scale = scale;
                            } 
                            
                            _wheelHandleTimeer = null;
                            _deltaY = 0;

                        }, _wheelHandleTimeLen);
                    };
                };


            };

        });

    }

    draw( opt ) {
    
        !opt && (opt = {});
        _.extend(true, this, opt);

        this._initData( opt.data ).then( data => {

            this.data = data;

            this._layoutData();

            this.widget();

            this.induce.context.width = this.width;
            this.induce.context.height = this.height;
            this.sprite.context.x = parseInt(this.origin.x);
            this.sprite.context.y = parseInt(this.origin.y);

            let _offsetLeft = (this.width - this.data.size.width) / 2;
            if (_offsetLeft < 0) {
                _offsetLeft = 0;
            };
            let _offsetTop = (this.height - this.data.size.height) / 2;
            if (_offsetTop < 0) {
                _offsetTop = 0;
            };
            
            this.graphsSp.context.x = parseInt(_offsetLeft);
            this.graphsSp.context.y = parseInt(_offsetTop);

            this.fire("complete");

        } );

    }

    //如果dataTrigger.origin 有传入， 则已经这个origin为参考点做重新布局
    //TODO， 如果这个图的options中有配置 一个 符合 关系图的数据{nodes, edges, size}
    //那么这个时候的resetData还不能满足，因为resetData的第一个个参数是dataFrame， 而options.data其实已经算是配置了，
    //后面遇到这个情况再调整吧
    resetData( dataFrame, dataTrigger ){
        this._resetData( dataFrame, dataTrigger ).then( ()=>{
            this.fire("complete");
        } );
    }

    _resetData( data, dataTrigger ){

        let me = this;
        this._preData = this.data;

        return new Promise( resolve => {

            this._initData( data ).then( _data => {

                this.data = _data;
            
                this._layoutData();

                _.each( this._preData.nodes, function( preNode ){
                    let nodeData = _.find( me.data.nodes, function( node ){ return preNode.key == node.key } );
                    if( !nodeData ){
                        me._destroy( preNode );
                    } else {
                        //如果找到了，要从前面
                        nodeData.focused  = preNode.focused;
                        nodeData.selected = preNode.selected;
                    }
                } );
                _.each( this._preData.edges, function( preEdge ){
                    if( !_.find( me.data.edges, function( edge ){ return preEdge.key.join('_') == edge.key.join('_') } ) ){
                        me._destroy( preEdge );
                    }
                } );

                this.widget();

                
                if( dataTrigger ){
                    let origin = dataTrigger.origin || (dataTrigger.params || {}).origin; //兼容老的配置里面没有params，直接传origin的情况
                    //钉住某个node为参考点（不移动)
                    if( origin != undefined ){
                        let preOriginNode = _.find( this._preData.nodes, (node) => { return node.key == origin } );
                        let originNode = _.find( this.data.nodes, (node) => { return node.key == origin } );
                        
                        if( preOriginNode && originNode ){
                            let offsetPos = { 
                                x: parseInt(preOriginNode.x)-parseInt(originNode.x), 
                                y: parseInt(preOriginNode.y)-parseInt(originNode.y)
                            };
                            let { x, y } = this.zoom.offset( offsetPos );
                            me.graphsView.context.x = parseInt(x);
                            me.graphsView.context.y = parseInt(y);
                        };
                    };
                };

                resolve();

            } );
        } );
    }



    _destroy( item ){
        
        item.shapeElement && item.shapeElement.destroy();

        if(item.contentElement.destroy){
            item.contentElement.destroy()
        } else {
            //否则就可定是个dom
            this.domContainer.removeChild( item.contentElement );
        };

        //下面的几个是销毁edge上面的元素
        item.pathElement     && item.pathElement.destroy();
        item.labelElement    && item.labelElement.destroy();
        item.arrowElement    && item.arrowElement.destroy();
        item.edgeIconElement && item.edgeIconElement.destroy();
        item.edgeIconBack    && item.edgeIconBack.destroy();
    }


    _getDefNode(){
        let node = {
            type: "relation",
            iNode: 0,
            rowData: null,
            key: "",
            content: '',
            _contentInited: false,
            ctype: 'canvas',

            //下面三个属性在_setElementAndSize中设置
            contentElement: null, //外面传的layout数据可能没有element，widget的时候要检测下
            width: null,
            height: null,

            //这个在layout的时候设置
            x: null,
            y: null,
            shapeType: null,

            //如果是edge，要填写这两节点
            source : null,
            target : null,

            focused : false,
            selected: false
        };  
        return node;
    }

    //$data如果用户设置了符合data的数据格式数据{nodes, edges, size}，那就直接返回
    _initData( $data ) {
        
        return new Promise( resolve => {

            if( $data && $data.nodes && $data.edges ){
                resolve( $data );
                return;
            };

            let data = {
                //{ type,key,content,ctype,width,height,x,y }
                nodes: [],
                //{ type,key[],content,ctype,width,height,x,y }
                edges: [],
                size: {width: 0,height: 0}
            };

            let originData = this.app._data;
            if ( checkDataIsJson(originData, this.field, this.childrenField) ) {
                this.jsonData = jsonToArrayForRelation(originData, this, this.childrenField);
                this.dataFrame = this.app.dataFrame = dataFrame( this.jsonData, this );
            } else {
                if( this.layout == "tree" ){
                    //源数据就是图表标准数据，只需要转换成json的Children格式
                    //app.dataFrame.jsonOrg ==> [{name: key:} ...] 不是children的树结构
                    this.jsonData = arrayToTreeJsonForRelation( JSON.parse( JSON.stringify(this.app.dataFrame.jsonOrg) ), this);
                };
            };


            for (let i = 0; i < this.dataFrame.length; i++) {
                let rowData = this.dataFrame.getRowDataAt(i);

                let fields = _.flatten([(rowData[this.field] + "").split(",")]);
                let content = this._getContent(rowData);

                let node = this._getDefNode();
                Object.assign( node, {
                    iNode: i,
                    rowData: rowData,
                    key: fields.length == 1 ? fields[0] : fields,
                    content: content,
                    ctype: this._checkHtml(content) ? 'html' : 'canvas'
                } );

                if( fields.length == 1 ){
                    //isNode
                    node.shapeType = this.getProp( this.node.shapeType, node );
                    Object.assign(node, this.layoutOpts.node);
                    data.nodes.push(node);
                } else {
                    // isEdge
                    node.shapeType = this.getProp( this.line.shapeType, node );
                    Object.assign(node, this.layoutOpts.edge);
                    data.edges.push(node);
                };
            };

            this._initAllDataSize(data).then( data => {
                resolve( data );
            } );

        } );
    }

    _initAllDataSize( data ){
        
        return new Promise( resolve => {

            let _nodeMap = {};
            let initNum  = 0;

            data.nodes.concat( data.edges ).forEach( node => {

                _nodeMap[ node.key ] = node;

                //计算和设置node的尺寸
                this._initContentAndGetSize( node ).then( opt => {

                    _.extend(node, opt);
                    //如果是菱形，还需要重新调整新的尺寸
                    if( node.shapeType == 'diamond' ){
                        //因为node的尺寸前面计算出来的是矩形的尺寸，如果是菱形的话，这里就是指内接矩形的尺寸，
                        //需要换算成外接矩形的尺寸
                        let innerRect = { //内接矩形
                            width: node.width,
                            height: node.height
                        };
                        let includedAngle = this.node.includedAngle/2;
                        let includeRad    = includedAngle * Math.PI / 180

                        let newWidthDiff  = innerRect.height / Math.tan( includeRad );
                        let newHeightDiff = innerRect.width  * Math.tan( includeRad );

                        //在内接矩形基础上扩展出来的外界矩形
                        let newWidth      = innerRect.width  + newWidthDiff;
                        let newHeight     = innerRect.height + newHeightDiff;

                        //把新的菱形的外界边界回写
                        node._innerRect   = {
                            width  : node.width,
                            height : node.height 
                        };
                        node.width        = newWidth;
                        node.height       = newHeight;
                        
                    };
                
                    node._contentInited = true;
                    initNum ++

                    //如果所有的node的size都初始化完毕
                    if( initNum == (data.nodes.length+data.edges.length) ){
                        //all is inited
                        //然后给edge填写source 和 target
                        _.each( data.edges, function( edge ){
                            let keys = edge.key;
                            edge.source = _nodeMap[ keys[0] ];
                            edge.target = _nodeMap[ keys[1] ];
                        } );
                        resolve( data );
                    };

                } );
            });

        } );
    }

    _layoutData(){
        if (this.layout == "dagre") {
            this._dagreLayout( this.data );
        } else if(this.layout == "tree"){
            this._treeLayout( this.data );
        } else if (_.isFunction(this.layout)) {
            //layout需要设置好data中nodes的xy， 以及edges的points，和 size的width，height
            this.layout(this.data);
        };
    }

    _dagreLayout(data) {
        //https://github.com/dagrejs/dagre/wiki
        
        let layout = global.layout.dagre || Dagre;

        let g = new layout.graphlib.Graph();
        g.setGraph( this.layoutOpts.graph );
        g.setDefaultEdgeLabel(function () {
            //其实我到现在都还没搞明白setDefaultEdgeLabel的作用
            return {};
        });

        _.each(data.nodes, function (node) {
            g.setNode(node.key, node);
        });
        _.each(data.edges, function (edge) {
            //后面的参数直接把edge对象传入进去的话，setEdge会吧point 和 x y 等信息写回edge
            g.setEdge(...edge.key, edge);
            //g.setEdge(edge.key[0],edge.key[1]);
        });

        layout.layout(g);

        data.size.width = g.graph().width;
        data.size.height = g.graph().height;

        //this.g = g;

        return data
    }

    //TODO: 待实现，目前其实用dagre可以直接实现tree，但是如果可以用更加轻便的tree也可以尝试下
    _treeLayout(  ){
        // let tree = global.layout.tree().separation(function(a, b) {
        //     //设置横向节点之间的间距
        //     let totalWidth = a.width + b.width;
        //     return (totalWidth/2) + 10;
        // });
        
        // let nodes = tree.nodes( this.jsonData[0] ).reverse();
        // let links = tree.links(nodes);
    }

    widget() {
        /*
        me.g.edges().forEach( e => {
            let edge = me.g.edge(e);
            console.log( edge )
        } );
        */
     
        this._drawEdges();
        this._drawNodes();
    }

    //画布偏移量
    offset( offset={x:0,y:0} ){
        let { x, y } = this.zoom.offset( offset );
        this.graphsView.context.x = parseInt(x);
        this.graphsView.context.y = parseInt(y);
    }

    //把某个节点移动到居中位置
    setNodeToCenter( key ){
        let nodeData = this.getNodeDataAt( key );
        if( nodeData ){
            let globalPos = nodeData.shapeElement.localToGlobal();
            let toGlobalPos = {
                x : this.app.width/2 - nodeData.width/2,
                y : this.app.height/2 - nodeData.height/2
            }
            let toCenterOffset = {
                x: parseInt( toGlobalPos.x - globalPos.x ), 
                y: parseInt( toGlobalPos.y - globalPos.y )
            };
            this.offset( toCenterOffset );
        }
    }

    _drawEdges(){
        let me = this;
        _.each(this.data.edges, function ( edge ) {

            console.log(edge.points)

            let key = edge.key.join('_');
            
            if( me.line.isTree && edge.points.length == 3 ){
                //严格树状图的话（三个点），就转化成4个点的，有两个拐点
                me._setTreePoints( edge );
            };

            let lineShapeOpt= me._getLineShape(edge, me.line.inflectionRadius)

            let type        = lineShapeOpt.type;  
            let path        = lineShapeOpt.path;
            let pointList   = lineShapeOpt.pointList;
            let shape       = type == 'path' ? Path : BrokenLine;

            let lineWidth   = me.getProp( me.line.lineWidth, edge );
            let strokeStyle = me.getProp( me.line.strokeStyle, edge );
            let lineType    = me.getProp( me.line.lineType, edge );
            let cursor      = me.getProp( me.line.cursor, edge );

            let edgeId = 'edge_'+key;
            let _path  = me.edgesSp.getChildById( edgeId );
            if( _path ){
                
                if( type == 'path' ){
                    _path.context.path = path;
                }
                if( type == 'brokenLine' ){
                    _path.context.pointList = pointList;
                }

                _path.context.lineWidth = lineWidth;
                _path.context.strokeStyle = strokeStyle;
                _path.context.lineType = lineType;

            } else {

                let _ctx = {
                    lineWidth,
                    strokeStyle,
                    lineType,
                    cursor
                }

                if( type == 'path' ){
                    _ctx.path = path;
                }
                if( type == 'brokenLine' ){
                    //_ctx.smooth = true;
                    //_ctx.curvature = 0.25;
                    _ctx.pointList = pointList;
                }

                _path = new shape({
                    id : edgeId,
                    context: _ctx
                });
                _path.on(event.types.get(), function (e) {
                    let node = this.nodeData;
                    node.__no_value = true;
                    e.eventInfo = {
                        trigger: me.line,
                        nodes: [ node ]
                    };
                    me.app.fire(e.type, e);
                });
                me.edgesSp.addChild(_path);
            };
            edge.pathElement = _path;
            _path.nodeData = edge; //edge也是一个node数据

            let arrowControl = edge.points.slice(-2, -1)[0];
            if( me.line.shapeType == "bezier" ){
                if( me.rankdir == "TB" || me.rankdir == "BT" ){
                    arrowControl.x += (edge.source.x-edge.target.x)/20
                }
                if( me.rankdir == "LR" || me.rankdir == "RL" ){
                    arrowControl.y += (edge.source.y-edge.target.y)/20
                }
            };
            


            
            let edgeLabelId  = 'label_'+key;
            let enabled      = me.getProp( me.line.edgeLabel.enabled, edge);
            if( enabled ){
                let textAlign    = me.getProp( me.node.content.textAlign    , edge);
                let textBaseline = me.getProp( me.node.content.textBaseline , edge);
                let fontSize     = me.getProp( me.line.edgeLabel.fontSize   , edge );
                let fontColor    = me.getProp( me.line.edgeLabel.fontColor  , edge );
                // let offsetX      = me.getProp( me.line.edgeLabel.offsetX    , edge );
                // let offsetY      = me.getProp( me.line.edgeLabel.offsetY    , edge );
                let offset       = me.getProp( me.line.icon.offset  , edge );
                if( !offset ) {  //default 使用edge.x edge.y 也就是edge label的位置
                    offset = {
                        x: edge.x,
                        y: edge.y
                    }
                };

                let _edgeLabel = me.labelsSp.getChildById(edgeLabelId);
                if( _edgeLabel ){
                    _edgeLabel.resetText( edge.content );
                    _edgeLabel.context.x = offset.x;
                    _edgeLabel.context.y = offset.y;
                    _edgeLabel.context.fontSize = fontSize;
                    _edgeLabel.context.fillStyle = fontColor;
                    _edgeLabel.context.textAlign = textAlign;
                    _edgeLabel.context.textBaseline = textBaseline;
                } else {
                    _edgeLabel = new Canvax.Display.Text( edge.content, {
                        id: edgeLabelId,
                        context: {
                            x: offset.x,
                            y: offset.y,
                            fontSize: fontSize,
                            fillStyle: fontColor,
                            textAlign,
                            textBaseline
                        }
                    });
                    _edgeLabel.on(event.types.get(), function (e) {
                        let node = this.nodeData;
                        node.__no_value = true;
                        e.eventInfo = {
                            trigger: me.line,
                            nodes: [ node ]
                        };
                        me.app.fire(e.type, e);
                    });
                    me.labelsSp.addChild( _edgeLabel );
                }
                edge.labelElement = _edgeLabel
                _edgeLabel.nodeData = edge;
            };

            let edgeIconEnabled  = me.getProp( me.line.icon.enabled, edge);
            if( edgeIconEnabled ){
                
                let _chartCode = me.getProp( me.line.icon.charCode, edge )
                let charCode   = String.fromCharCode(parseInt( _chartCode , 16));
               
                if( _chartCode != '' ){
                    let lineWidth    = me.getProp( me.line.icon.lineWidth   , edge );
                    let strokeStyle  = me.getProp( me.line.icon.strokeStyle , edge );
                    let fontFamily   = me.getProp( me.line.icon.fontFamily  , edge );
                    let fontSize     = me.getProp( me.line.icon.fontSize    , edge );
                    let fontColor    = me.getProp( me.line.icon.fontColor   , edge );
                    let background   = me.getProp( me.line.icon.background  , edge );
                    let textAlign    = 'center';
                    let textBaseline = 'middle';
    
                    let offset       = me.getProp( me.line.icon.offset  , edge );
                    let offsetX      = me.getProp( me.line.icon.offsetX  , edge );
                    let offsetY      = me.getProp( me.line.icon.offsetY  , edge );
                    if( !offset ) {  //default 使用edge.x edge.y 也就是edge label的位置
                        offset = {
                            x: parseInt(edge.x)+offsetX, 
                            y: parseInt(edge.y)+offsetY
                        }
                    };

                    let _iconBackCtx   = {
                        x : offset.x,
                        y : offset.y - 1,
                        r : parseInt(fontSize*0.5)+2,
                        fillStyle : background,
                        strokeStyle,
                        lineWidth
                    };
                    let edgeIconBackId = 'edge_item_icon_back_'+key;
                    let _iconBack = me.labelsSp.getChildById( edgeIconBackId );
                    if( _iconBack ){
                        //_.extend( true, _iconBack.context, _iconBackCtx )
                        Object.assign(_iconBack.context, _iconBackCtx);
                    } else {
                        _iconBack = new Circle({
                            id: edgeIconBackId,
                            context: _iconBackCtx
                        });
                        me.labelsSp.addChild( _iconBack );
                    };
                    edge.edgeIconBack = _iconBack
                    _iconBack.nodeData = edge;


                    let edgeIconId   = 'edge_item_icon_'+key;
                    let _edgeIcon = me.labelsSp.getChildById(edgeIconId);
                    if( _edgeIcon ){

                        _edgeIcon.resetText( charCode );
                        _edgeIcon.context.x            = offset.x;
                        _edgeIcon.context.y            = offset.y;
                        _edgeIcon.context.fontSize     = fontSize;
                        _edgeIcon.context.fillStyle    = fontColor;
                        _edgeIcon.context.textAlign    = textAlign;
                        _edgeIcon.context.textBaseline = textBaseline;
                        _edgeIcon.context.fontFamily   = fontFamily;
                        //_edgeIcon.context.lineWidth    = lineWidth;
                        //_edgeIcon.context.strokeStyle  = strokeStyle;

                    } else {
                        _edgeIcon = new Canvax.Display.Text( charCode, {
                            id: edgeIconId,
                            context: {
                                x         : offset.x,
                                y         : offset.y,
                                fillStyle : fontColor,
                                cursor    : 'pointer',
                                fontSize,
                                textAlign,
                                textBaseline,
                                fontFamily
                            }
                        });
                        _edgeIcon.on(event.types.get(), function (e) {
                            let node = this.nodeData;
                            node.__no_value = true;
                            let trigger = me.line;
                            if( me.line.icon[ 'on'+e.type ] ){
                                trigger = me.line.icon;
                            };
                            e.eventInfo = {
                                trigger,
                                nodes: [ node ]
                            };
                            me.app.fire(e.type, e);

                        });
                        me.labelsSp.addChild( _edgeIcon );
                    }
                    edge.edgeIconElement = _edgeIcon
                    _edgeIcon.nodeData = edge;

                }
            };

            
            if( me.line.arrow.enabled ){
                let arrowId = "arrow_"+key;
                
                let _arrow = me.arrowsSp.getChildById(arrowId);
                if( _arrow ){
                    //arrow 只监听了x y 才会重绘，，，暂时只能这样处理,手动的赋值control.x control.y
                    //而不是直接把 arrowControl 赋值给 control

                    _arrow.context.x = me.line.arrow.offsetX;
                    _arrow.context.y = me.line.arrow.offsetY;
                    _arrow.context.fillStyle = strokeStyle;
                    _arrow.context.control.x = arrowControl.x;
                    _arrow.context.control.y = arrowControl.y;
                    _arrow.context.point = edge.points.slice(-1)[0];
                    _arrow.context.strokeStyle = strokeStyle;
                    _arrow.context.fillStyle = strokeStyle;
                    // _.extend(true, _arrow, {
                    //     control: arrowControl,
                    //     point: edge.points.slice(-1)[0],
                    //     strokeStyle: strokeStyle
                    // } );
                } else {
                    _arrow = new Arrow({
                        id: arrowId,
                        context: {
                            x: me.line.arrow.offsetX,
                            y: me.line.arrow.offsetY,
                            control     : arrowControl,
                            point       : edge.points.slice(-1)[0],
                            strokeStyle : strokeStyle,
                            fillStyle   : strokeStyle
                        }
                    });
                    me.arrowsSp.addChild(_arrow);
                };

                edge.arrowElement = _arrow;
                
            };
    
        });
    }

    _drawNodes(){
        let me = this;
        _.each(this.data.nodes, function (node) {
            me._drawNode( node );
        });
    }

    _drawNode( node ){
        let me = this;
        
        let shape = Rect;

        let nodeId = "node_"+node.key;

        let cursor = me.node.cursor;

        let { lineWidth,fillStyle,strokeStyle,radius,shadowOffsetX,shadowOffsetY,shadowBlur,shadowColor } = me._getNodeStyle( node );   

        let context = {
            x: parseInt(node.x) - parseInt(node.width / 2),
            y: parseInt(node.y) - parseInt(node.height / 2),
            width: node.width,
            height: node.height,
            cursor,
            lineWidth,
            fillStyle,
            strokeStyle,
            radius,
            shadowOffsetX,shadowOffsetY,shadowBlur,shadowColor
        };
        if( node.shapeType == 'diamond' ){
            shape = Diamond;
            context = {
                x: parseInt(node.x),
                y: parseInt(node.y),
                cursor,
                innerRect : node._innerRect,
                lineWidth,
                fillStyle,
                strokeStyle,
                shadowOffsetX,shadowOffsetY,shadowBlur,shadowColor
            }
        };
        
        let _boxShape = me.nodesSp.getChildById( nodeId );
        if( _boxShape ){
            _.extend( _boxShape.context, context );
        } else {
            _boxShape = new shape({
                id: nodeId,
                hoverClone: false,
                context
            });
            me.nodesSp.addChild(_boxShape);
            _boxShape.on(event.types.get(), function (e) {
                let node = this.nodeData;
                node.__no_value = true;
                e.eventInfo = {
                    trigger: me.node,
                    nodes: [ node ]
                };

                if( me.node.focus.enabled ){
                    if( e.type == "mouseover" ){
                        me.focusAt( this.nodeData );
                    }
                    if( e.type == "mouseout" ){
                        me.unfocusAt( this.nodeData );
                    }
                };
        
                if( me.node.select.enabled && me.node.select.triggerEventType.indexOf(e.type) > -1 ){
                    //如果开启了图表的选中交互
                    //TODO:这里不能
                    let onbefore = me.node.select.onbefore;
                    let onend    = me.node.select.onend;
                    if( !onbefore || ( typeof onbefore == 'function' && onbefore.apply(me, [this.nodeData]) !== false ) ){
                        if( this.nodeData.selected ){
                            //说明已经选中了
                            me.unselectAt( this.nodeData );
                        } else {
                            me.selectAt( this.nodeData );
                        }
                        onend && typeof onend == 'function' && onend.apply( me, [this.nodeData] );
                    }
                    
                };

                me.app.fire(e.type, e);
            });
        };
    
        _boxShape.nodeData = node;
        node.shapeElement = _boxShape;

        if( me.node.select.list.indexOf( node.key ) > -1 ){
            me.selectAt( node );
        };
        if (node.ctype == "canvas") {
            node.contentElement.context.visible = true;
        };

        _boxShape.on("transform", function() {
            if (node.ctype == "canvas") {
                node.contentElement.context.x = parseInt(node.x);
                node.contentElement.context.y = parseInt(node.y);
            } else if (node.ctype == "html") {
                let devicePixelRatio = typeof (window) !== 'undefined' ? window.devicePixelRatio : 1;
                let contentMatrix = _boxShape.worldTransform.clone();
                contentMatrix = contentMatrix.scale(1 / devicePixelRatio, 1 / devicePixelRatio);
                
                node.contentElement.style.transform = "matrix(" + contentMatrix.toArray().join() + ")";
                node.contentElement.style.transformOrigin = "left top"; //修改为左上角为旋转中心点来和canvas同步
                if( node.shapeType == 'diamond' ){
                    node.contentElement.style.left = -parseInt((node._innerRect.width/2) * me.status.transform.scale) + "px";
                    node.contentElement.style.top = -parseInt((node._innerRect.height/2) * me.status.transform.scale) + "px";
                };
                node.contentElement.style.visibility = "visible";
            };
        });
    }

    _getNodeStyle( nodeData , targetPath){
        let me = this;

        let radius = _.flatten([me.getProp(me.node.radius, nodeData)]);

        let target = me.node;
        if( targetPath == 'select' ){
            target = me.node.select;
        }
        if( targetPath == 'focus' ){
            target = me.node.focus;
        }

        let lineWidth     = me.getProp(target.lineWidth, nodeData);
        let fillStyle     = me.getProp(target.fillStyle, nodeData);
        let strokeStyle   = me.getProp(target.strokeStyle, nodeData);
        let shadowOffsetX = me.getProp(target.shadow.shadowOffsetX, nodeData);
        let shadowOffsetY = me.getProp(target.shadow.shadowOffsetY, nodeData);
        let shadowBlur    = me.getProp(target.shadow.shadowBlur, nodeData);
        let shadowColor   = me.getProp(target.shadow.shadowColor, nodeData);

        return {
            lineWidth,fillStyle,strokeStyle,radius,shadowOffsetX,shadowOffsetY,shadowBlur,shadowColor
        };
    }

    _setNodeStyle( nodeData , targetPath ){
        let { lineWidth,fillStyle,strokeStyle,shadowOffsetX,shadowOffsetY,shadowBlur,shadowColor } = this._getNodeStyle( nodeData, targetPath ); 
        if(nodeData.shapeElement && nodeData.shapeElement.context){
            let ctx = nodeData.shapeElement.context;
            ctx.lineWidth     = lineWidth;
            ctx.fillStyle     = fillStyle;
            ctx.strokeStyle   = strokeStyle;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
            ctx.shadowBlur    = shadowBlur;
            ctx.shadowColor   = shadowColor;
        }
    }


    focusAt( key ){
        let nodeData = this.getNodeDataAt( key );
        if( nodeData ){
            !nodeData.selected && this._setNodeStyle( nodeData, 'focus' );
            nodeData.focused = true;
        }
    }
    unfocusAt( key ){
        let nodeData = this.getNodeDataAt( key );
        if( nodeData ){
            !nodeData.selected && this._setNodeStyle( nodeData );
            nodeData.focused = false;
        }
    }
    selectAt( key ){
        let nodeData = this.getNodeDataAt( key );
        if( nodeData ){
            this._setNodeStyle( nodeData, 'select' );
            nodeData.selected = true;
            if( this.node.select.list.indexOf( nodeData.key ) == -1 ){
                this.node.select.list.push( nodeData.key );
            }
        }
    }
    selectAll(){
        this.data.nodes.forEach(nodeData => {
            this.selectAt( nodeData );
        });
    }
    unselectAt( key ){
        let nodeData = this.getNodeDataAt( key );
        if( nodeData ){
            nodeData.focused ? this._setNodeStyle( nodeData, 'focus' ) : this._setNodeStyle( nodeData );
            nodeData.selected = false;
            let selectedKeyInd = this.node.select.list.indexOf( nodeData.key )
            if( selectedKeyInd > -1 ){
                this.node.select.list.splice( selectedKeyInd, 1 );
            }
        }
    }
    unselectAll(){
        this.data.nodes.forEach(nodeData => {
            this.unselectAt( nodeData );
        });
    }

    getNodeDataAt( key ){
        if( key.type && (key.type == "relation" || key.type == "tree") ){
            return key
        };
        if( typeof key == 'string' ){
            let keys = key.split(',');
            if( keys.length == 1 ){
                return this.data.nodes.find( item => item.key == key )
            }
            if( keys.length == 2 ){
                return this.data.edges.find( item => item.key.join() == keys.join() )
            }
        };
    }

    _setTreePoints( edge ){
        let points = edge.points;
      
        if( this.rankdir == "TB" || this.rankdir == "BT" ){
            points[0] = {
                x : edge.source.x,
                y : edge.source.y + (this.rankdir == "BT"?-1:1)*edge.source.height/2
            };
            points.splice(1,0,{
                x : edge.source.x,
                y : points.slice(-2,-1)[0].y
            });
        }
        if( this.rankdir == "LR" || this.rankdir == "RL" ){
            points[0] = {
                x : edge.source.x + (this.rankdir == "RL"?-1:1)*edge.source.width/2,
                y : edge.source.y
            };
            points.splice(1,0,{
                x : points.slice(-2,-1)[0].x,
                y : edge.source.y
            });
        }

        edge.points = points;
    }

    /**
     * 
     * @param {shapeType,points} edge 
     * @param {number} inflectionRadius 拐点的圆角半径
     */
    _getLineShape(edge, inflectionRadius) {
        
        let points = edge.points;

        let line = {
            type: 'path', // pah or brokenLine
            pointList: null,
            path: str
        };

        let head = points[0];
        let tail = points.slice(-1)[0];
        let str = "M" + head.x + " " + head.y;
        
        if( edge.shapeType == "bezier" ){
            if( points.length == 3 ){
                str += ",Q" + points[1].x + " " + points[1].y + " " + tail.x + " " + tail.y;
            }
            if( points.length == 4 ){
                str += ",C" + points[1].x + " " + points[1].y + " "+ points[2].x + " " + points[2].y + " " + tail.x + " " + tail.y;
            }
            if( points.length >= 5 ){
                line.type = 'brokenLine';
                line.pointList = points.map( item => {
                    return [ item.x, item.y ]
                } );
                return line;
            }
        };

        if( edge.shapeType == "brokenLine" ){
            _.each( points, function( point, i ){
                
                if( i ){
                    if( inflectionRadius && i<points.length-1 ){
                        
                        //圆角连线
                        let prePoint = points[i-1];
                        let nextPoint= points[i+1];
                        //要从这个点到上个点的半径距离，已point为控制点，绘制nextPoint的半径距离

                        let radius = inflectionRadius;
                        //radius要做次二次校验，取radius 以及 point 和prePoint距离以及和 nextPoint 的最小值
                        //let _disPre = Math.abs(Math.sqrt( (prePoint.x - point.x)*(prePoint.x - point.x) + (prePoint.y - point.y)*(prePoint.y - point.y) ));
                        //let _disNext = Math.abs(Math.sqrt( (nextPoint.x - point.x)*(nextPoint.x - point.x) + (nextPoint.y - point.y)*(nextPoint.y - point.y) ));
                        let _disPre = Math.max( Math.abs( prePoint.x - point.x )/2, Math.abs( prePoint.y - point.y )/2 );
                        let _disNext = Math.max( Math.abs( nextPoint.x - point.x )/2, Math.abs( nextPoint.y - point.y )/2 );
                        radius = _.min( [radius, _disPre, _disNext] );

                        //console.log(Math.atan2( point.y - prePoint.y , point.x - prePoint.x ),Math.atan2( nextPoint.y - point.y , nextPoint.x - point.x ))
                        
                        if( 
                            (point.x == prePoint.x && point.y == prePoint.y ) ||
                            (point.x == nextPoint.x && point.y == nextPoint.y ) ||
                            (Math.atan2( point.y - prePoint.y , point.x - prePoint.x ) == Math.atan2( nextPoint.y - point.y , nextPoint.x - point.x ) )
                        ){
                            //如果中间的这个点 ， 和前后的点在一个直线上面，就略过
                            return;
                        } else {
                            function getPointOf( p ){
                                let _atan2 = Math.atan2( p.y - point.y , p.x - point.x );
                                return {
                                    x : point.x+radius * Math.cos( _atan2 ),
                                    y : point.y+radius * Math.sin( _atan2 )
                                }
                            };
                            let bezierBegin = getPointOf( prePoint );
                            let bezierEnd = getPointOf( nextPoint );
                            str +=",L"+bezierBegin.x+" "+bezierBegin.y+",Q"+ point.x + " " + point.y+" "+ bezierEnd.x + " " + bezierEnd.y
                        }
                    } else {
                        //直角连线
                        str += ",L" + point.x + " " + point.y;
                    };
                }
            } );
        };

        line.path = str;
        //str += "z"
        return line;
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
        let field = this.node.content.field;
        if (this._isField(field)) {
            _c = rowData[ field ];
        };
        if (me.node.content.format && _.isFunction(me.node.content.format)) {
            _c = me.node.content.format.apply(this, [ _c, rowData ]);
        } else {
            //否则用fieldConfig上面的
            let _coord = me.app.getComponent({name:'coord'});
            let fieldConfig = _coord.getFieldConfig( field );
            if(fieldConfig ){
                _c = fieldConfig.getFormatValue( _c );
            };
        }
        return _c;
    }

    _isField(str) {
        return ~this.dataFrame.fields.indexOf(str)
    }

    _initContentAndGetSize(node) {
        let me = this;
        let contentType = node.ctype;

        if (me._isField(contentType)) {
            contentType = node.rowData[contentType];
        };

        !contentType && (contentType = 'canvas');

        if (contentType == 'canvas') {
            return me._getEleAndsetCanvasSize(node);
        };
        if (contentType == 'html') {
            return me._getEleAndsetHtmlSize(node);
        };

    }
    
    _getEleAndsetCanvasSize(node) {
        let me = this;
        return new Promise(resolve => {
            
            let content = node.content;
            let width = node.rowData.width, height = node.rowData.height;

            //let sprite = new Canvax.Display.Sprite({});

            let context = {
                fillStyle: me.getProp(me.node.content.fontColor, node),
                textAlign: me.getProp(me.node.content.textAlign, node),
                textBaseline: me.getProp(me.node.content.textBaseline, node)
            };
            //console.log(node.key);
            let contentLabelId = "content_label_"+node.key;
            let _contentLabel = me.nodesContentSp.getChildById( contentLabelId );
            if( _contentLabel ){
                //已经存在的label
                _contentLabel.resetText( content );
                _.extend( _contentLabel.context, context );
            } else {
                //新创建text，根据 text 来计算node需要的width和height
                _contentLabel = new Canvax.Display.Text(content, {
                    id: contentLabelId,
                    context
                });
                _contentLabel.context.visible = false;
                if( !_.isArray( node.key ) ){
                    me.nodesContentSp.addChild( _contentLabel );
                };
            };

            let inited;
            if( this.node.content.init && typeof this.node.content.init === 'function' ){
                inited = this.node.content.init(node, _contentLabel);
            };

            if( inited && typeof inited.then == 'function' ){
                inited.then( ()=> {
                    if ( !width ) {
                        width = _contentLabel.getTextWidth() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
                    };
                    if ( !height ) {
                        height = _contentLabel.getTextHeight() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
                    };
                    resolve( {
                        contentElement : _contentLabel,
                        width          : width,
                        height         : height
                    });
                } )
            } else {
                if ( !width ) {
                    width = _contentLabel.getTextWidth() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
                };
                if ( !height ) {
                    height = _contentLabel.getTextHeight() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
                };
    
                resolve( {
                    contentElement : _contentLabel,
                    width          : width,
                    height         : height
                });
            } 
        });

    }
    _getEleAndsetHtmlSize(node) {
        let me = this;
        return new Promise( resolve => {

            let content = node.content;
            let width = node.rowData.width, height = node.rowData.height;

            let contentLabelClass = "__content_label_"+node.key;
            let _dom = this.domContainer.getElementsByClassName( contentLabelClass );
            if( !_dom.length ){
                _dom = document.createElement("div");
                _dom.className = "chartx_relation_node "+contentLabelClass;
                _dom.style.cssText += "; position:absolute;visibility:hidden;"
                this.domContainer.appendChild(_dom);
            } else {
                _dom = _dom[0]
            };
            _dom.style.cssText += "; color:" + me.getProp(me.node.content.fontColor, node) + ";";
            _dom.style.cssText += "; text-align:" + me.getProp(me.node.content.textAlign, node) + ";";
            _dom.style.cssText += "; vertical-align:" + me.getProp(me.node.content.textBaseline, node) + ";";
            //_dom.style.cssText += "; padding:"+me.getProp(me.node.padding, node)+"px;";

            _dom.innerHTML = content;

            let inited;
            if( this.node.content.init && typeof this.node.content.init === 'function' ){
                inited = this.node.content.init(node, _dom);
            };

            if( inited && typeof inited.then == 'function' ){
                inited.then( ( opt ) => {
                    if (!width) {
                        width = _dom.offsetWidth; // + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
                    };
                    if (!height) {
                        height = _dom.offsetHeight; // + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
                    };
                    resolve({
                        contentElement : _dom,
                        width          : width,
                        height         : height
                    });
                } );
            } else {
                if (!width) {
                    width = _dom.offsetWidth; // + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
                };
                if (!height) {
                    height = _dom.offsetHeight; // + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
                };
                resolve({
                    contentElement : _dom,
                    width          : width,
                    height         : height
                })
            };
        } );

    }

    getNodesAt() {

    }

    getProp( prop, nodeData ) {
        let _prop = prop;
        if( this._isField( prop ) ){
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

GraphsBase.registerComponent(Relation, 'graphs', 'relation');

export default Relation