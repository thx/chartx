import Canvax from "canvax"
import GraphsBase from "./base"
import {getDefaultProps} from "../../../utils/tools"
import Trigger from "../../trigger"
import Layout from "../../../layout/tree/tree"

let { _, event } = Canvax;
let Circle  = Canvax.Shapes.Circle;

let Rect    = Canvax.Shapes.Rect;

//内部交互需要同步回源数据的属性， 树状图要实现文本的编辑，所以content也要加入进来
let syncToOriginKeys = ['collapsed', 'style', 'content'];
let iconWidth= 20;

 
/**
 * 关系图中 包括了  配置，数据，和布局数据，
 * 默认用配置和数据可以完成绘图， 但是如果有布局数据，就绘图玩额外调用一次绘图，把布局数据传入修正布局效果
 */
class compactTree extends GraphsBase {
    static defaultProps() {
        return {
            childrenField: {
                detail: '树结构数据的关联字段',
                documentation: '如果是树结构的关联数据，不是行列式，那么就通过这个字段来建立父子关系',
                default: 'children'
            },
            rankdir:{
                detail : '布局方向',
                default: 'LR'
            },
            layout: {
                detail: '紧凑的树布局方案， 也可以设置为一个function，自定义布局算法',
                default: "tree"
            },
            layoutOpts: {
                detail: '布局引擎对应的配置',
                propertys: {
                    
                }
            },
            ranksep:{
                detail : '排与排之间的距离',
                default: 40
            },
            nodesep:{
                detail : '同级node之间的距离',
                default: 20
            },
            node: {
                detail: '单个节点的配置',
                propertys: {
                    content: {
                        detail:' 内容配置',
                        propertys: {
                            textAlign: {
                                detail: '左右对齐方式',
                                default: 'left'
                            }
                        }
                    },
                    collapse: {
                        detail: '树状图是否有节点收缩按钮',
                        propertys: {
                            enabled: {
                                detail: "是否开启",
                                default: true
                            },
                            field: {
                                detail: "用来记录collapsed是否折叠的字段，在节点的数据上",
                                default: "collapsed"
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
                                default: 10
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
                                default: 0
                            },
                            offsetY: {
                                detail: 'y方向偏移量',
                                default: 0
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
                    },
                    preIcon: {
                        detail: '内容前面的一个icon，主要用来描这个node的类型',
                        propertys: {
                            charCode: {
                                detail: "icon的iconfont字符串",
                                default: ''
                            },
                            fontSize: {
                                detail: "icon字号大小",
                                default: 18
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
                                default: 0
                            },
                            offsetY: {
                                detail: 'y方向偏移量',
                                default: 0
                            }
                        }
                    },
                    icons: {
                        detail: '内容后面的一组icon，是个数组， 支持函数返回一组icon，单个icon的格式和preIcon保持一致',
                        propertys: {
                            charCode: {
                                detail: "icon的iconfont字符串",
                                default: []
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
                                default: 0
                            },
                            offsetY: {
                                detail: 'y方向偏移量',
                                default: 0
                            }
                        }
                    }
                }
            },
            line: {
                detail: '连线配置',
                propertys: {
                    arrow: {
                        detail: '箭头配置',
                        propertys: {
                            enabled: {
                                detail: '是否显示',
                                default: false
                            }
                        }
                    },
                    edgeLabel: {
                        detail: '连线文本',
                        propertys: {
                            enabled: {
                                detail: '是否要连线的文本',
                                default: false
                            }
                        }
                    },
                    icon: {
                        detail: '连线上的icon',
                        propertys: {
                            enabled: {
                                detail: '是否要连线上的icon',
                                default: false
                            }
                        }
                    }
                }
            }
        }
    }

    constructor(opt, app, preComp) {
        super(opt, app, preComp);
        this.type = "compacttree";
        _.extend(true, this, getDefaultProps(compactTree.defaultProps()), opt);

    }

    draw( opt ) {
        
        !opt && (opt = {});
        _.extend(true, this, opt);

        this.initData( opt.data ).then( data => {

            this.data = data;

            this.layoutData();

            this.widget();

            this.induce.context.width = this.width;
            this.induce.context.height = this.height;
            this.sprite.context.x = parseInt(this.origin.x);
            this.sprite.context.y = parseInt(this.origin.y);

            //test bound
            // this._bound = new Rect({
            //     context: {
            //         x: this.data.extents.left,
            //         y: this.data.extents.top,
            //         width: this.data.size.width,
            //         height: this.data.size.height,
            //         lineWidth:1,
            //         strokeStyle: 'red'
            //     }
            // });
            // this.graphsSp.addChild( this._bound )


            if( !this.preGraphsSpPosition ){
                this.graphsSpPosition = {
                    x : Math.max( (this.width - this.data.size.width)/2, this.app.padding.left ),
                    y : this.height/2,
                }
            } else {
                this.graphsSpPosition = {
                    x : this.preGraphsSpPosition.x,
                    y : this.preGraphsSpPosition.y,
                }
            }
            
            this.graphsSp.context.x = this.graphsSpPosition.x;
            this.graphsSp.context.y = this.graphsSpPosition.y;

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

            //test bound
            // Object.assign( this._bound.context, {
            //     x: this.data.extents.left,
            //     y: this.data.extents.top,
            //     width: this.data.size.width,
            //     height: this.data.size.height
            // } );

        } );
    }

    widget() {
        this._drawEdges();
        this._drawNodes();
    }

    //$data如果用户设置了符合data的数据格式数据{nodes, edges, size, extents}，那就直接返回
    initData( $data, $dataTrigger ) {
        
        return new Promise( resolve => {

            if( $data && $data.nodes && $data.edges ){
                resolve( $data );
                return;
            };

            let data = {
                // relation 也好，  tree也好， 最后都要转换成 nodes edges  渲染统一依赖 nodes 和 edges
                //{ type,key,content,ctype,width,height,x,y }
                nodes: [],
                //{ type,key[],content,ctype,width,height,x,y }
                edges: [],

                size: {width: 0,height: 0},
                treeOriginData: null, //原始全量的treeData
                treeData: null, //折叠过滤掉后的需要渲染的treeData
                nodesLength: 0
            };
            
            let originData = this.app._data;
            data.treeOriginData = originData;

            //TODO 这里可以 判断 $dataTrigger 如果是来自图表内部的 collapse 等， 
            //就可以不用走下面的 arrayToTreeJsonForRelation ， 后续优化
            
            //项目里一般都建议直接使用treeData的格式，但是这里要做一次判断是因为chartpark上面做的demo只能下面的格式
            /**
             * [ {id:1,label:''},{id:2,label:''},{id:'1,2',label:''} ]
             */
            //要把这个格式转成 {id:1,children: [{id:2}]} 这样的格式
            //注意，这里不能用dataFrame去做判断，判断不出来的，只能用原始的 originData
            if( Array.isArray( originData ) ){
                data.treeOriginData = this.arrayToTreeJsonForRelation(this.app.dataFrame.jsonOrg, this);
            }

            let t = new Date().getTime()
            //然后从treeOriginData 过滤掉 需要显示的子树 到 treeData
            //{treeData, nodeLength}这里设置了这两个属性
            Object.assign( data, this._filterTreeData( data.treeOriginData ) ); 
            console.log( data.nodesLength+'个节点构建树:', new Date().getTime() - t );

            let t1 = new Date().getTime()
            this._initAllDataSize( data ).then( () => {
                //这个时候已经设置好了 treeData 的 size 属性width、height
                //可以开始布局了，布局完就可以设置好 data 的 nodes edges 和 size 属性
                console.log( data.nodesLength+'个节点计算size:', new Date().getTime() - t1 );
                resolve( data );
            } );


        } );
    }

    //treeOriginData 一定是一个 树结构的
    _filterTreeData( treeOriginData ){
        let nodesLength = 1;
        let collapsedField = this.node.collapse.field;
        let childrenField = this.childrenField;

        let nodes = [];
        let edges = [];

        // let treeData = {};

        // Object.assign( treeData, treeOriginData );
        // let childrenField = this.childrenField;
        // let children = treeOriginData[ childrenField ];
        // treeData[ childrenField ] = [];

        //parent指向的是treeData不是originData，这里要注意下
        let filter = ( treeOriginData, parent, depth, rowInd, treeData ) => {
            if( treeOriginData ){

                Object.assign( treeData, {
                    depth: depth || 0,
                    parent,
                    rowInd//在parent中的Index
                } );

                //resetData的时候，有些节点原本有数据的
                let preChildrenList = treeData[ childrenField ] || [];

                Object.assign( treeData, treeOriginData );
                treeData['__originData'] = treeOriginData; //和原数据建立下关系，比如 treeData 中的一些数据便跟了要同步到原数据中去
                treeData[ childrenField ] = [];

                
                if( treeData?.style?.visible == 'hidden' ) {
                    return;
                }

                //开始构建nodes
                let content = this._getContent( treeData );

                //下面这个判断逻辑主要用在resetData的时候用
                if( treeData._node && content != treeData._node.content ){
                    treeData._node = null;
                    delete treeData._node;

                    if( !treeData.style ){
                        treeData.style = {
                            width:0,
                            height:0
                        }
                    }
                    if( !treeOriginData.style || ( treeOriginData.style && ( !treeOriginData.style.width || !treeOriginData.style.height ) ) ){
                        treeData.style.width = 0;
                        treeData.style.height = 0;
                    }
                };

                let node = this.getDefNode({
                    type: 'tree'
                });
                
                Object.assign( node, {
                    iNode: nodes.length,
                    rowData: treeData,
                    key: treeData[this.field],
                    content: content,
                    ctype: this._checkHtml(content) ? 'html' : 'canvas',
                    width: 0,
                    height: 0,
                    depth: depth || 0 //深度
                } );
                //不能放到assign中去，  getProp的处理中可能依赖node.rowData
                node.shapeType = this.getProp( this.node.shapeType, node );

                node.preIconCharCode = this.getProp( this.node.preIcon.charCode, node );
                node.iconCharCodes   = this.getProp( this.node.icons.charCode, node ) || [];

                nodes.push(node);
    
                treeData._node = node;

                if( !treeData[ collapsedField ] ){
                    //如果这个节点未折叠
                    //检查他的子节点
                    (treeOriginData[ childrenField ] || []).forEach( (child,rowInd) => {

                        let preChildTreeData = preChildrenList.find( item => item[this.field] == child[this.field] ) || {};
                        
                        let childTreeData = filter( child , treeData,  depth+1, rowInd, preChildTreeData);
                        
                        if( childTreeData ){
                            treeData[ childrenField ].push( childTreeData );
                            nodesLength++;
        
                            //开始构建edges
                            let rowData = {};
                            let content = ''; //this._getContent(rowData);
        
                            let edge = this.getDefNode({
                                type: 'tree'
                            });
                            
                            Object.assign( edge, {
        
                                isTree: true,
                                iNode: edges.length,
                                rowData,
                                key: [treeData[ this.field ] , childTreeData[ this.field ]],//treeData[ this.field ]+","+child[ this.field ],
                                content: content,
                                ctype: this._checkHtml(content) ? 'html' : 'canvas',
        
                                //如果是edge，要有source 和 target
                                source : treeData._node,
                                target : childTreeData._node,
                                sourceTreeData: treeData,
                                targetTreeData: childTreeData
                    
                            } );
                            edge.shapeType = this.getProp( this.line.shapeType, edge );
                            edges.push(edge);
                        }
                        

                    }); 
                }
            }
            return treeData;
            
        }

        

        let preTreeData = this.data?.treeData || {};
        let treeData = filter( treeOriginData, null, 0 , 0, preTreeData);
        
        return {treeData, nodesLength, nodes, edges};
        
    }


    //所有对nodeData原始数据的改变都需要同步到原数据, 比如 collapsed 折叠状态, 还有动态计算出来的width 和 height
    _syncToOrigin( treeData ){
        for( let k in treeData ){
            if( syncToOriginKeys.indexOf( k ) > -1 ){
                treeData.__originData[ k ] = treeData[k]
            }
        }
    }

    _eachTreeDataHandle( treeData, handle ){
        handle && handle(treeData);
        (treeData[ this.childrenField ] || []).forEach( nodeData => {
            this._eachTreeDataHandle( nodeData, handle )
        });
    }

    _initAllDataSize( data ){

        let { treeData, nodesLength } = data;

        let initNum = 0;
        return new Promise( resolve => {
            this._eachTreeDataHandle( treeData, ( treeDataItem )=>{
                
                //计算和设置node的尺寸
                this._setSize( treeDataItem ).then( () => {
                    
                    this._setNodeBoundingClientWidth( treeDataItem ); 
                    // 重新校验一下size， 比如菱形的 外界矩形是不一样的
                    this.checkNodeSizeForShapeType( treeDataItem._node );   

                    initNum ++
                    if( initNum == nodesLength ){
                        //全部处理完毕了
                        resolve( data )
                    }
                } );
            } )
        });

    }

    _setNodeBoundingClientWidth( treeData ){
        let node = treeData._node;

        let boundingClientWidth = node.width || 0;
        
        if( node.shapeType != 'diamond' && node.depth ){
            if( treeData.__originData[ this.childrenField ] && treeData.__originData[ this.childrenField ].length ){
                boundingClientWidth += iconWidth
            };
        }

        if( node.preIconCharCode ){
            boundingClientWidth += iconWidth
        };

        if( node.iconCharCodes && node.iconCharCodes.length ){
            boundingClientWidth += iconWidth * node.iconCharCodes.length
        };

        node.boundingClientWidth = boundingClientWidth;
    }

    _setSize( treeData ) {
        return new Promise( resolve => {
            let node = treeData._node;
            
            //这里的width都是指内容的size
            let width = treeData.width || ( treeData.style && treeData.style.width ) || this.getProp( this.node.width, treeData );
            let height = treeData.height || ( treeData.style && treeData.style.height ) || this.getProp( this.node.height, treeData );
    
            if( width && height ){
                //如果node上面已经有了 尺寸 
                //（treeData中自己带了尺寸数据，或者node.width node.height设置了固定的尺寸配置）
                // 这个时候 contentElement 可能就是空（可以有可视范围内渲染优化，布局阶段不需要初始化contentElement），
                let sizeOpt = {
                    width,height,
                    contentElement: node.contentElement
                };
                // opt -> contentElement,width,height 
                _.extend(node, sizeOpt);

                resolve( sizeOpt )
                
                return;
            };

            //如果配置中没有设置size并且treedata中没有记录size，那么就只能初始化了cotnent来动态计算
            this._initcontentElementAndSize( treeData ).then( sizeOpt => {
                _.extend(node, sizeOpt);
                resolve( sizeOpt )
            } );
            
        } );

    }

    //通过 初始化 contnt 来动态计算 size 的走这里
    _initcontentElementAndSize( treeData ){
        return new Promise( resolve => {
            let node = treeData._node;

            //那么，走到这里， 就说明需要动态的计算size尺寸，动态计算， 是一定要有contentElement的
            let contentType = node.ctype;
    
            if (this._isField(contentType)) {
                contentType = node.rowData[contentType];
            };
    
            !contentType && (contentType = 'canvas');
    
            let _initEle;
            if (contentType == 'canvas') {
                _initEle = this._getEleAndsetCanvasSize;
            };
            if (contentType == 'html') {
                _initEle = this._getEleAndsetHtmlSize;
            };

            _initEle.apply( this, [node] ).then( sizeOpt  => {
                // sizeOpt -> contentElement,width,height 
                _.extend(node, sizeOpt);
                //动态计算的尺寸，要写入到treeData中去，然后同步到 treeData的 originData，
                //这样就可以 和 整个originData一起存入数据库，后续可以加快再次打开的渲染速度
                if( !treeData.style ){
                    treeData.style = {}
                };
                treeData.style.width = node.width;
                treeData.style.height = node.height;
                this._syncToOrigin( treeData );

                resolve( sizeOpt );
            } );

        } );
    }

    layoutData(){
        if (_.isFunction(this.layout)) {
            //layout需要设置好data中nodes的xy， 以及edges的points，和 size的width，height
            this.layout( this.data );
        } else {
            this.treeLayout( this.data );  //tree中自己实现layout
        }
    }

    treeLayout( data ){
        let childrenField = this.childrenField;
        let layoutIsHorizontal = this.rankdir == 'LR' || this.rankdir == 'RL';
        //layoutIsHorizontal = false;
        let t1 = new Date().getTime();
        const spaceX = this.nodesep; //20;
        const spaceY = this.ranksep; //20;
        const layout = Layout({ 
            spacing: spaceX ,
            nodeSize: node => {
                
                //计算的尺寸已经node的数据为准， 不取treeData的
                let height = node.data._node.height || 0;
                let boundingClientWidth = node.data._node.boundingClientWidth || 0;

                if( layoutIsHorizontal ){
                    return [ height, boundingClientWidth+spaceY ]
                }
                
                return [ boundingClientWidth, height+spaceY ] //因为节点高度包含节点下方的间距
            },
            children: data => data[ childrenField ]
        });
        
        const _tree = layout.hierarchy( data.treeData );
        
        const _layout = layout(_tree);

        let left=0,top=0,right=0,bottom=0;
        let maxRight=0,maxLeft=0,maxTop=0,maxBottom=0;
        let width=0,height=0;

        _layout.each(node => {

            if( layoutIsHorizontal ){
                let x = node.x;
                node.x = node.y;
                node.y = x;
            };
            
            if( node.x <= left  ){
                maxRight = node.x + node.data._node.boundingClientWidth
            };
            left = Math.min( left, node.x );

            if( node.x + node.data._node.boundingClientWidth >= right ){
                maxLeft = node.x;
            };
            right = Math.max( right, node.x + node.data._node.boundingClientWidth );

            if( node.y <= top ){
                maxBottom = node.y + node.data._node.height;
            };
            top = Math.min( top, node.y );

            if( node.y + node.data._node.height+ spaceY >= bottom ){
                maxTop = node.y
            }
            bottom = Math.max( bottom, node.y + node.data._node.height+ spaceY );
         
            //node的x y 都是矩形的中心点
            node.data._node.x = node.x + node.data._node.boundingClientWidth/2;
            node.data._node.y = node.y + node.data._node.height/2;
            node.data._node.depth = node.depth;

        });

        width = right - left;
        height = bottom - top - spaceY;

        ////设置edge的points
        data.edges.forEach( edge => {
            this.getEdgePoints( edge );
        });

        console.log( data.nodesLength+'个节点计算layout:', new Date().getTime() - t1 );
        
        Object.assign( data,  {
            size: {
                width, height
            },
            extents: {
                left, top, right, bottom
            },
            viewPort: {
                maxRight,maxLeft,maxTop,maxBottom
            }
        });

    }

    //可以继承覆盖
    getEdgePoints( edge ){
        let points = [];

        //firstPoint
        let firstPoint = {
            x: parseInt(edge.source.x+edge.source.boundingClientWidth/2),
            y: parseInt(edge.source.y)
        }
        if( !edge.source.depth ){ //根节点
            firstPoint.x = parseInt(edge.source.x);
        }
        if( edge.source.shapeType == 'underLine' ){
            firstPoint.y = parseInt(edge.source.y + edge.source.height/2)
        }
        points.push( firstPoint )
        
        let secPoint = {
            x: firstPoint.x + 10,
            y: firstPoint.y
        };
        points.push( secPoint )


        //lastPoint
        let lastPoint = {
            x: parseInt(edge.target.x - edge.target.boundingClientWidth/2),
            y: parseInt(edge.target.y)
        }
        if( edge.target.shapeType == 'underLine' ){
            lastPoint.y = parseInt(edge.target.y + edge.target.height/2)
        }

        //LR
        points.push( {
            x: secPoint.x + parseInt((lastPoint.x - secPoint.x)/2),
            y: lastPoint.y
        } );

        points.push( lastPoint );

        edge.points = points;
        return points

    }

    _drawNodes(){
        let me = this;
        _.each(this.data.nodes, (node) => {
            let key = node.rowData[this.field];

            let drawNode = ()=>{
                this._drawNode( node );
                //处理一些tree 相对 relation 特有的逻辑
                //collapse
                if( node.depth && this.node.collapse.enabled ){
                    
                    let iconId     = key+"_collapse_icon";
                    let iconBackId = key+"_collapse_icon_back";

                    if( node.rowData[ this.childrenField ] && node.rowData.__originData[ this.childrenField ] && node.rowData.__originData[ this.childrenField ].length ){
                        
                        let charCode   = this.node.collapse.openCharCode;
                        if( !node.rowData.collapsed ){
                            charCode   = this.node.collapse.closeCharCode;
                        };
                        let iconText   = String.fromCharCode(parseInt( this.getProp( charCode , node) , 16));
                        
                        let fontSize   = this.getProp( this.node.collapse.fontSize    , node);
                        let fontColor  = this.getProp( this.node.collapse.fontColor   , node);
                        let fontFamily = this.getProp( this.node.collapse.fontFamily  , node);
                        let offsetX    = this.getProp( this.node.collapse.offsetX     , node);
                        let offsetY    = this.getProp( this.node.collapse.offsetY     , node);
                        let tipsContent= this.getProp( this.node.collapse.tipsContent , node);
    
                        let background = this.getProp( this.node.collapse.background  , node);
                        let lineWidth  = this.getProp( this.node.collapse.lineWidth   , node);
                        let strokeStyle= this.getProp( this.node.collapse.strokeStyle , node);
                        
                        let _collapseIcon= this.labelsSp.getChildById( iconId );
                        let _collapseIconBack = this.labelsSp.getChildById( iconBackId );
    
                        let x = parseInt(node.x+node.boundingClientWidth/2+offsetX-this.node.padding-fontSize/4);
                        if(  node.shapeType == 'diamond' ){
                            x += this.node.padding + fontSize*1 + 1;
                        }
                        let y = parseInt(node.y+offsetY);
                        //collapseIcon的 位置默认为左右方向的xy
                        let collapseCtx = {
                            x: x,
                            y: y + 1,
                            fontSize,
                            fontFamily,
                            fillStyle: fontColor,
                            textAlign: "center",
                            textBaseline: "middle",
                            cursor: 'pointer'
                        };
    
                        let r = parseInt(fontSize*0.5) + 2;
                        let _collapseBackCtx = {
                            x : x,
                            y : y,
                            r,
                            fillStyle : background,
                            strokeStyle,
                            lineWidth
                        }
    
                        if( _collapseIcon ){
                            _collapseIcon.resetText( iconText );
                            Object.assign( _collapseIcon.context   , collapseCtx );
                            Object.assign( _collapseIconBack.context, _collapseBackCtx );
                        } else {
                            _collapseIcon = new Canvax.Display.Text( iconText , {
                                id: iconId,
                                context: collapseCtx
                            });
    
                            _collapseIconBack = new Circle( {
                                id: iconBackId,
                                context: _collapseBackCtx
                            } );
    
                            this.labelsSp.addChild( _collapseIconBack );
                            this.labelsSp.addChild( _collapseIcon );
    
                            _collapseIcon._collapseIconBack = _collapseIconBack;
                            
                            let me = this;
                            //这里不能用箭头函数，听我的没错
                            _collapseIcon.on( event.types.get(), function(e){
                    
                                let trigger = me.node.collapse;
                                e.eventInfo = {
                                    trigger,
                                    tipsContent,
                                    nodes: [] //node
                                };
    
                                //下面的这个就只在鼠标环境下有就好了
                                if( _collapseIconBack.context ){
                                    if( e.type == 'mousedown' ){
                                        _collapseIconBack.context.r += 1;
                                    }
                                    if( e.type == 'mouseup' ){
                                        _collapseIconBack.context.r -= 1;
                                    }
                                };
                               
                                if( me.node.collapse.triggerEventType.indexOf( e.type ) > -1 ){
                                    
                                    this.nodeData.rowData.collapsed = !this.nodeData.rowData.collapsed;
                                    me._syncToOrigin( this.nodeData.rowData );
    
                                    let trigger = new Trigger( me, {
                                        origin : key
                                    } );
    
                                    me.app.resetData( null ,  trigger);
                                }
                                
                                me.app.fire(e.type, e);
    
                            });
                        };
    
                        //TODO: 这个赋值只能在这里处理， 因为resetData的时候， 每次node都是一个新的node数据
                        //collapseIcon的引用就断了
                        _collapseIcon.nodeData = node;
                        node.collapseIcon = _collapseIcon;
                        node.collapseIconBack = _collapseIconBack;
    
                    } else {
                        let _collapseIcon = this.labelsSp.getChildById(iconId);
                        if( _collapseIcon ) _collapseIcon.destroy();

                        let _collapseIconBack = this.labelsSp.getChildById(iconBackId);
                        if( _collapseIconBack ) _collapseIconBack.destroy();
                    }
                    
                }

                let getIconStyle = function( prop, charCode ){
                    let iconText   = String.fromCharCode(parseInt( charCode , 16));
                    let fontSize   = me.getProp( prop.fontSize, node, charCode);
                    let fontColor  = me.getProp( prop.fontColor, node, charCode);
                    let fontFamily = me.getProp( prop.fontFamily, node, charCode);
                    let offsetX    = me.getProp( prop.offsetX, node, charCode);
                    let offsetY    = me.getProp( prop.offsetY, node, charCode);
                    let tipsContent= me.getProp( prop.tipsContent, node, charCode);

                    return {
                        iconText,
                        fontSize,
                        fontColor,
                        fontFamily,
                        offsetX,
                        offsetY,
                        tipsContent
                    }
                }

                //绘制preIcon
                if( node.preIconCharCode ){

                    let preIconId = key+"_pre_icon";
                    let { 
                        iconText,
                        fontSize,
                        fontColor,
                        fontFamily,
                        offsetX,
                        offsetY,
                        tipsContent 
                    } = getIconStyle( this.node.preIcon, node.preIconCharCode );

                    let x = parseInt(node.x - node.boundingClientWidth/2 + this.node.padding + offsetX);
                    let y = parseInt(node.y+offsetY);
                    //collapseIcon的 位置默认为左右方向的xy
                    let preIconCtx = {
                        x: x,
                        y: y + 1,
                        fontSize,
                        fontFamily,
                        fillStyle: fontColor,
                        textAlign: "left",
                        textBaseline: "middle",
                        cursor: 'pointer'
                    };
                    let _preIcon= this.labelsSp.getChildById( preIconId );
                    if( _preIcon ){
                        _preIcon.resetText( iconText );
                        Object.assign( _preIcon.context, preIconCtx );
                    } else {
                        _preIcon = new Canvax.Display.Text( iconText , {
                            id: preIconId,
                            context: preIconCtx
                        });
                        this.labelsSp.addChild( _preIcon );
                    };

                    //TODO: 这个赋值只能在这里处理， 因为resetData的时候， 每次node都是一个新的node数据
                    //collapseIcon的引用就断了
                    node.preIconEl = _preIcon;

                } else {
                    if( node.preIconEl ){
                        node.preIconEl.destroy();
                        delete node.preIconEl;
                    }
                }

                //绘制icons 待续...
                if( node.iconCharCodes && node.iconCharCodes.length ){
                    let iconsSpId = key+"_icons_sp";

                } else {
                    if( node.iconsSp ){
                        node.iconsSp.destroy();
                        delete node.iconsSp;
                    }
                }
            }

            //绘制的时候一定要准备好conentElement的
            this._initcontentElementAndSize( node.rowData ).then( ()=>{
                drawNode();
            } )
          
            // if( !node.contentElement ){
            //     //绘制的时候如果发现没有 contentElement，那么就要把 contentElement 初始化了
            //     this._initcontentElementAndSize( node.rowData ).then( ()=>{
            //         drawNode();
            //     } )
            // } else {
            //     drawNode();
            // }
            
        });
    }

    _destroy( item ){
        item.shapeElement && item.shapeElement.destroy();

        if( item.contentElement ){
            if(item.contentElement.destroy){
                item.contentElement.destroy()
            } else {
                //否则就可定是个dom
                this.domContainer.removeChild( item.contentElement );
            };
        };

        //下面的几个是销毁edge上面的元素
        item.pathElement      && item.pathElement.destroy();
        item.labelElement     && item.labelElement.destroy();
        item.arrowElement     && item.arrowElement.destroy();
        item.edgeIconElement  && item.edgeIconElement.destroy();
        item.edgeIconBack     && item.edgeIconBack.destroy();

        //下面两个是tree中独有的
        item.collapseIcon     && item.collapseIcon.destroy();
        item.collapseIconBack && item.collapseIconBack.destroy();

        item.preIconEl        && item.preIconEl.destroy();

        if( Array.isArray( item[this.field] ) ){
            //是个edge的话，要检查下源头是不是没有子节点了， 没有子节点了， 还要把collapseIcon 都干掉
            let sourceNode = item.source;
            
            if( !this.data.edges.find( item => item[this.field][0] == sourceNode[this.field] ) ){
                //如歌edges里面还有 targetNode[this.field] 开头的，targetNode 还有子节点, 否则就可以把 targetNode的collapseIcon去掉
                sourceNode.collapseIcon && sourceNode.collapseIcon.destroy();
                sourceNode.collapseIconBack  && sourceNode.collapseIconBack.destroy();
            }
        }

    }

    arrayToTreeJsonForRelation(data){
        // [ { key: 1, name: },{key:'1,2'} ] to [ { name: children: [ {}... ] } ] 
        
        let _nodes = {}
        let _edges = {}
        _.each( data, ( item )=>{
            let key = item[ this.field ]+'';
            if( key.split(',').length == 1 ){
                _nodes[ key ] = item;
            } else {
                _edges[ key ] = item;
            };
        } );
        
        //先找到所有的一层
        let arr = [];
        _.each( _nodes, ( node, nkey )=>{
            let isFirstLev=true;
            _.each( _edges, ( edge, ekey )=>{
                ekey = ekey+'';
                if( ekey.split(',')[1] == nkey ){
                    isFirstLev = false;
                    return false;
                }
            } );
            if( isFirstLev ){
                arr.push( node );
                node.__inRelation = true;
            };
        } );
    
        //有了第一层就好办了
        let getChildren = ( list )=>{
    
            _.each( list, ( node )=>{
                if( node.__cycle ) return;
                let key = node[ this.field ];
                _.each( _edges, ( edge, ekey )=>{
                    ekey = ekey + '';
                    if( ekey.split(',')[0] == key ){
                        //那么说明[1] 就是自己的children
                        let childNode = _nodes[ ekey.split(',')[1] ];
    
                        if( childNode ){
                            if( !node[ this.childrenField ] ) node[ this.childrenField ] = [];
    
                            if( !_.find( node[ this.childrenField ], (_child)=>{
                                return _child[ this.field ] == childNode[ this.field ]
                            } ) ) {
                              node[ this.childrenField ].push(childNode);
                            };
                            //node[ this.childrenField ].push( childNode );
    
                            //如果这个目标节点__inRelation已经在关系结构中
                            //那么说明形成闭环了，不需要再分析这个节点的children
                            if( childNode.__inRelation ){
                                childNode.__cycle = true;
                            };
                        }
                    }
                } );
                if( node[ this.childrenField ] && node[ this.childrenField ].length ){
                    getChildren( node[ this.childrenField ] );
                };
            } );
    
        };
    
        getChildren( arr );
    
        return arr.length ? arr[0] : null;
    }
}

GraphsBase.registerComponent(compactTree, 'graphs', 'compacttree');

export default compactTree