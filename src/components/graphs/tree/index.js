import Canvax from "canvax"
import GraphsBase from "../relation/index"
import dataFrame from "../../../core/dataFrame"
import {getDefaultProps} from "../../../utils/tools"
import Trigger from "../../trigger"
import { checkDataIsJson, jsonToArrayForRelation, arrayToTreeJsonForRelation } from '../relation/data'

let { _, event } = Canvax;
let Rect    = Canvax.Shapes.Rect;
let Diamond = Canvax.Shapes.Diamond;
let Path    = Canvax.Shapes.Path;
let Circle  = Canvax.Shapes.Circle;
let Arrow   = Canvax.Shapes.Arrow;

 
/**
 * 关系图中 包括了  配置，数据，和布局数据，
 * 默认用配置和数据可以完成绘图， 但是如果有布局数据，就绘图玩额外调用一次绘图，把布局数据传入修正布局效果
 */
class Tree extends GraphsBase {
    static defaultProps() {
        return {
            field: {
                detail: 'key字段设置',
                documentation: '',
                default: null
            },
            node: {
                detail: '单个节点的配置',
                propertys: {
                    shrink: {
                        detail: '树状图是否有节点收缩按钮',
                        propertys: {
                            enabled: {
                                detail: "是否开启",
                                default: true
                            },
                            triggerEventType: {
                                detail: '触发事件',
                                default:'click,tap'
                            },
                            openCharCode: {
                                detail: "点击后触发展开的icon chartCode，当前状态为收缩",
                                default: ''
                            },
                            closeCharCode: {
                                detail: "点击后触发收缩的icon chartCode，当前状态为展开",
                                default: ''
                            },
                            fontSize: {
                                detail: "icon字号大小",
                                default: 12
                            },
                            fontColor: {
                                detail: "icon字体颜色",
                                default: '#666'
                            },
                            fontFamily: {
                                detail: "icon在css中的fontFamily",
                                default: 'iconfont'
                            },
                            tipsContent: {
                                detail: '鼠标移动到收缩icon上面的tips内容',
                                default: ''
                            },
                            offsetX: {
                                detail: 'x方向偏移量',
                                default: 10
                            },
                            offsetY: {
                                detail: 'y方向偏移量',
                                default: 1
                            },
                            background: {
                                detail: 'icon的 背景色',
                                default: '#fff'
                            },
                            lineWidth: {
                                detail: '边框大小',
                                default: 1
                            },
                            strokeStyle: {
                                detail: '描边颜色',
                                default: '#667894'
                            }
                        }
                    }
                }
            }
        }
    }

    constructor(opt, app) {
        super(opt, app);
        this.type = "tree";

        this.shrinked = []; //所有被设置了收缩的node的key

        _.extend(true, this, getDefaultProps(Tree.defaultProps()), opt);

    }

    _initData( _data ) {
        
        return new Promise( resolve => {

            if( _data && _data.nodes && _data.edges ){
                resolve( _data );
                return;
            };

            let data = {
                //{ type,key,content,ctype,width,height,x,y }
                nodes: [],
                //{ type,key[],content,ctype,width,height,x,y }
                edges: [],
                size : {width: 0,height: 0}
            };

            let originData = this.app._data;
            if ( checkDataIsJson(originData, this.field, this.childrenField) ) {
                this.jsonData = jsonToArrayForRelation(originData, this, this.childrenField);
                this.dataFrame = this.app.dataFrame = dataFrame( this.jsonData );
            } else {
                //源数据就是图表标准数据，只需要转换成json的Children格式
                //app.dataFrame.jsonOrg ==> [{name: key:} ...] 不是children的树结构
                this.jsonData = arrayToTreeJsonForRelation(this.app.dataFrame.jsonOrg, this);
            };

            let setData = ( list, parentRowData )=>{
                list.forEach( rowData => {
                    
                    let key = rowData[ this.field ];
                    let content = this._getContent(rowData);

                    //let preNode = this._preData ? this._preData.nodes.find( item => item.key == key ) : null
                    let node = this._getDefNode();
                    Object.assign( node, {
                        type: 'tree',
                        iNode: rowData.__index__,
                        rowData: rowData,
                        key: key,
                        content: content,
                        ctype: this._checkHtml(content) ? 'html' : 'canvas'
                    } );
                    node.shapeType = this.getProp( this.node.shapeType, node );
                    Object.assign(node, this.layoutOpts.node);
                    data.nodes.push(node);

                    //如果有parent，那么就还有连线需要处理
                    if( parentRowData ){
                        //edge在relation中也是一个标准的node数据结构
                        let edgeKey = [parentRowData[this.field], rowData[ this.field ]];
                        
                        //let preEdge = this._preData ? this._preData.edges.find( item => item.key.join(',') == edgeKey.join(',') ) : null
                        let edge = this._getDefNode();
                        let edgeFilter = {};
                        edgeFilter[ this.field ] = edgeKey.join(',');
                        let edgeRowDatas = this.dataFrame.getRowDataOf(edgeFilter);
                        if( edgeRowDatas && edgeRowDatas.length ){
                            //edgeRowData
                            let edgeRowData = edgeRowDatas[0];
                            let edgeContent = this._getContent(edgeRowData);
                            Object.assign( edge, {
                                type: 'tree',
                                iNode: edgeRowData.__index__,
                                rowData: edgeRowData,
                                key: edgeKey,
                                content: edgeContent,
                                ctype: this._checkHtml(edgeContent) ? 'html' : 'canvas'
                            } );
                            edge.shapeType = this.getProp( this.line.shapeType, edge );
                            Object.assign(edge, this.layoutOpts.edge);
                            data.edges.push(edge);
                        }
                        
                    };

                    if( rowData.children && this.shrinked.indexOf( key ) == -1 ){
                        setData( rowData.children, rowData );
                    };
                    

                });
            };

            setData( this.jsonData );
            
            this._initAllDataSize(data).then( data => {
                resolve( data );
            } );

        } );
    }

    _drawNodes(){
        let me = this;
        _.each(this.data.nodes, (node) => {
            this._drawNode( node );
            //shrink
            if( this.node.shrink.enabled ){
                if( node.rowData.children && node.rowData.children.length ){
                    let iconId     = node.key+"_shrink_icon";
                    let iconBackId = node.key+"_shrink_icon_back";

                    let charCode   = this.node.shrink.openCharCode;
                    if( this.shrinked.indexOf( node.key ) == -1 ){
                        charCode   = this.node.shrink.closeCharCode;
                    };
                    let iconText   = String.fromCharCode(parseInt( this.getProp( charCode , node) , 16));
                    
                    let fontSize   = this.getProp( this.node.shrink.fontSize    , node);
                    let fontColor  = this.getProp( this.node.shrink.fontColor   , node);
                    let fontFamily = this.getProp( this.node.shrink.fontFamily  , node);
                    let offsetX    = this.getProp( this.node.shrink.offsetX     , node);
                    let offsetY    = this.getProp( this.node.shrink.offsetY     , node);
                    let tipsContent= this.getProp( this.node.shrink.tipsContent , node);

                    let background = this.getProp( this.node.shrink.background  , node);
                    let lineWidth  = this.getProp( this.node.shrink.lineWidth  , node);
                    let strokeStyle= this.getProp( this.node.shrink.strokeStyle  , node);
                    
                    let _shrinkIcon= this.labelsSp.getChildById( iconId );
                    let _shrinkIconBack = this.labelsSp.getChildById( iconBackId );

                    let x = parseInt(node.x+node.width/2+offsetX);
                    let y = parseInt(node.y+offsetY);
                    //shrinkIcon的 位置默认为左右方向的xy
                    let shrinkCtx = {
                        x: x,
                        y: y + 1,
                        fontSize,
                        fontFamily,
                        fillStyle: fontColor,
                        textAlign: "center",
                        textBaseline: "middle",
                        cursor: 'pointer'
                    };

                    let _shrinkBackCtx = {
                        x : x,
                        y : y,
                        r : parseInt(fontSize*0.5) + 2,
                        fillStyle : background,
                        strokeStyle,
                        lineWidth
                    }

                    if( _shrinkIcon ){
                        _shrinkIcon.resetText( iconText );
                        Object.assign( _shrinkIcon.context   , shrinkCtx );
                        Object.assign( _shrinkIconBack.context, _shrinkBackCtx );
                    } else {
                        _shrinkIcon = new Canvax.Display.Text( iconText , {
                            id: iconId,
                            context: shrinkCtx
                        });

                        _shrinkIconBack = new Circle( {
                            id: iconBackId,
                            context: _shrinkBackCtx
                        } );

                        this.labelsSp.addChild( _shrinkIconBack );
                        this.labelsSp.addChild( _shrinkIcon );

                        _shrinkIcon._shrinkIconBack = _shrinkIconBack;
                        _shrinkIcon.on( event.types.get(), (e)=> {
                
                            let trigger = this.node.shrink;
                            e.eventInfo = {
                                trigger,
                                tipsContent,
                                nodes: [] //node
                            };

                            //下面的这个就只在鼠标环境下有就好了
                            if( _shrinkIconBack.context ){
                                if( e.type == 'mousedown' ){
                                    _shrinkIconBack.context.r += 1;
                                }
                                if( e.type == 'mouseup' ){
                                    _shrinkIconBack.context.r -= 1;
                                }
                            };
                           
                            if( this.node.shrink.triggerEventType.indexOf( e.type ) > -1 ){
                                if(this.shrinked.indexOf( node.key ) == -1){
                                    this.shrinked.push( node.key );
                                } else {
                                    for( var i=0,l=this.shrinked.length; i<l; i++ ){
                                        if( this.shrinked[i] == node.key ){
                                            this.shrinked.splice( i,1 );
                                            i--;l--;
                                        }
                                    }
                                };

                                let trigger = new Trigger( me, {
                                    origin : node.key
                                } );

                                this.app.resetData( null ,  trigger);
                            }
                            
                            this.app.fire(e.type, e);

                        });
                    };

                    //TODO: 这个赋值只能在这里处理， 因为resetData的时候， 每次node都是一个新的node数据
                    //shrinkIcon的引用就断了
                    _shrinkIcon.nodeData = node;
                    node.shrinkIcon = _shrinkIcon;
                    node.shrinkIconBack = _shrinkIconBack;

                }
                
            }
        });
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

        //下面两个是tree中独有的
        item.shrinkIcon      && item.shrinkIcon.destroy();
        item.shrinkIconBack  && item.shrinkIconBack.destroy();

        if( Array.isArray( item.key ) ){
            //是个edge的话，要检查下源头是不是没有子节点了， 没有子节点了， 还要把shrinkIcon 都干掉
            let sourceNode = item.source;
            
            if( !this.data.edges.find( item => item.key[0] == sourceNode.key ) ){
                //如歌edges里面还有 targetNode.key 开头的，targetNode 还有子节点, 否则就可以把 targetNode的shrinkIcon去掉
                sourceNode.shrinkIcon && sourceNode.shrinkIcon.destroy();
                sourceNode.shrinkIconBack  && sourceNode.shrinkIconBack.destroy();
            }
        }

    }


    

}

GraphsBase.registerComponent(Tree, 'graphs', 'tree');

export default Tree