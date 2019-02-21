import Canvax from "canvax"
import GraphsBase from "../index"
import { _,global, getDefaultProps,event } from "mmvis"

const Rect  = Canvax.Shapes.Rect;
const Path  = Canvax.Shapes.Path;
const Arrow = Canvax.Shapes.Arrow;
const Circle = Canvax.Shapes.Circle;

/**
 * 关系图中 包括了  配置，数据，和布局数据，
 * 默认用配置和数据可以完成绘图， 但是如果有布局数据，就绘图玩额外调用一次绘图，把布局数据传入修正布局效果
 */

export default class Relation extends GraphsBase
{
    static defaultProps(){
        return {
            field : {
                detail : 'key字段设置',
                documentation : '',
                default: null
            },
            node : {
                detail : '单个节点的配置',
                propertys: {
                    maxWidth: {
                        detail: '节点最大的width',
                        default: 200
                    },
                    width: {
                        detail :'内容的width',
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
                        default: '#ffffff'
                    },
                    strokeStyle: {
                        detail: '描边颜色',
                        default: '#e5e5e5'
                    },
                    padding: {
                        detail: 'node节点容器到内容的边距',
                        default: 10
                    },
                    content : {
                        detail : '节点内容配置',
                        propertys: {
                            field : {
                                detail : '内容，可以是字段，也可以是函数',
                                documentation : '默认content字段',
                                default: 'content'
                            },
                            fontColor: {
                                detail : '内容文本颜色',
                                default: '#666'
                            },
                            format : {
                                detail: '内容格式化处理函数',
                                default: null
                            },
                            textAlign: {
                                detail: "textAlign",
                                default: "center"
                            },
                            textBaseline: {
                                detail : 'textBaseline',
                                default: "middle"
                            }
                        }
                    }
                }
            },
            line: {
                detail : '两个节点连线配置',
                propertys: {
                    strokeStyle: {
                        detail : '连线的颜色',
                        default: '#e5e5e5'
                    },
                    lineType: {
                        detail : '连线样式（虚线等）',
                        default: 'solid'
                    },
                    arrow : {

                    },
                    strokeStyle: {

                    }
                }
            },
            layout: {
                detail: '采用的布局引擎,比如dagre',
                default: "dagre"
            },
            layoutOpts: {
                detail: '布局引擎对应的配置,dagre详见dagre的官方wiki',
                default: {}
            },

            status: {
                detail: '一些开关配置',
                propertys: {
                    transform : {
                        detail : "是否启动拖拽缩放整个画布",
                        propertys : {
                            enabled : {
                                detail: "是否开启",
                                default: true
                            },
                            scale : {
                                detail: "缩放值",
                                default: 1
                            },
                            scaleOrigin : {
                                detail : "缩放原点",
                                default: {
                                    x : 0,y:0
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    constructor(opt, app)
    {
        super(opt, app);
        this.type = "relation";

        _.extend( true, this , getDefaultProps( Relation.defaultProps() ), opt );

        var dagreOpts = {
            graph : {
                nodesep: 10,
                ranksep: 10,
                edgesep: 10,
                acyclicer : "greedy"
            },
            node : {

            },
            edge : {
                labelpos: 'c'
            }
        };
        _.extend(true, this.layoutOpts, dagreOpts, this.layoutOpts);

        this.domContainer = app.canvax.domView;
        this.induce = null;

        this.init();
    }

    init()
    {
        this.initInduce();

        this.nodesSp = new Canvax.Display.Sprite({
            id: "nodesSp"
        });
        this.edgesSp = new Canvax.Display.Sprite({
            id: "edgesSp"
        });
        this.graphsSp = new Canvax.Display.Sprite({
            id: "graphsSp"
        });
        this.graphsSp.addChild( this.edgesSp );
        this.graphsSp.addChild( this.nodesSp );
        this.sprite.addChild( this.graphsSp );
    }

    initInduce(){
        var me = this;
        this.induce = new Rect({
            id : "induce",
            context: {
                width : 0,
                height: 0,
                fillStyle: "#000000",
                globalAlpha: 0
            }
        });
        this.sprite.addChild( this.induce );

        var _mosedownIng = false;
        var _lastDragPoint = null;
        var _preCursor = me.app.canvax.domView.style.cursor;


        //滚轮缩放相关
        var _wheelHandleTimeLen = 32; //16*2
        var _wheelHandleTimeer = null;
        var _deltaY = 0;

        this.induce.on( event.types.get() , function(e){
            
            if( me.status.transform.enabled ){
                if( e.type == "mousedown" ){
                    me.induce.toFront();
                    _mosedownIng = true;
                    _lastDragPoint = e.point;
                    me.app.canvax.domView.style.cursor = "move"
                };
                if( e.type == "mouseup" || e.type == "mouseout" ){
                    me.induce.toBack();
                    _mosedownIng = false;
                    _lastDragPoint = null;
                    me.app.canvax.domView.style.cursor = _preCursor;
                };
                if( e.type == "mousemove" ){
                    if( _mosedownIng ){
                        me.graphsSp.context.x += (e.point.x - _lastDragPoint.x);
                        me.graphsSp.context.y += (e.point.y - _lastDragPoint.y);
                        _lastDragPoint = e.point;
                    }
                };
                if( e.type == "wheel" ){
                    if( Math.abs( e.deltaY ) > Math.abs( _deltaY ) ){
                        _deltaY = e.deltaY;
                    };
                    
                    if( !_wheelHandleTimeer ){
                        _wheelHandleTimeer = setTimeout( function(){
                            var point = me.graphsSp.globalToLocal( e.target.localToGlobal( e.point ) );
                            if( point.x > 1000 ){
                                debugger
                            }
                            me.scale( {
                                deltaY : _deltaY
                            } , point );
                            _wheelHandleTimeer = null;
                            _deltaY = 0;
                        } , _wheelHandleTimeLen );
                    };

                    e.preventDefault();
                };
            };
            
        } );
        
    }

    scale( opt, point ){
        

        var itemLen = 0.02;
        
        var _scale = (opt.deltaY/30)*itemLen;
        if( Math.abs(_scale)< 0.04 ){
            _scale = Math.sign( _scale ) * 0.04
        }
        if( Math.abs(_scale)> 0.08 ){
            _scale = Math.sign( _scale ) * 0.08
        }
        var scale = this.status.transform.scale + _scale;
        if( scale <= 0.1 ){
            scale = 0.1;
        }
        if( scale >= 1 ){
            //关系图里面放大看是没必要的
            scale = 1;
        }

        var scaleOrigin = point || {x:0,y:0};

        console.log( scale+"|"+JSON.stringify(scaleOrigin) )

        this.status.transform.scale = scale;
        this.status.transform.scaleOrigin.x = scaleOrigin.x;
        this.status.transform.scaleOrigin.y = scaleOrigin.y;

        this.graphsSp.context.scaleX = scale;
        this.graphsSp.context.scaleY = scale;
        this.graphsSp.context.scaleOrigin.x = scaleOrigin.x;
        this.graphsSp.context.scaleOrigin.y = scaleOrigin.y;
    }

    draw( opt ){
        !opt && (opt ={});
        _.extend( true, this , opt );
        this.data = this._initData();

        if( this.layout == "dagre" ){
            this.dagreLayout( this.data );
        } else if( _.isFunction( this.layout ) ) {
            //layout需要设置好data中nodes的xy， 以及edges的points，和 size的width，height
            this.layout( this.data );
        };
    
        this.widget();
        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        var _offsetLet = ( this.width - this.data.size.width )/2;
        if( _offsetLet < 0 ){
            _offsetLet = 0;
        };
        this.graphsSp.context.x = _offsetLet;
    }

    _initData(){
        var data = {
            nodes : [

            ],
            edges : [
                
            ],
            size: {
                width : 0,
                height: 0
            }
        };
        for( var i=0; i < this.dataFrame.length; i++ ){
            var metaData = this.dataFrame.getRowDataAt(i);

            this._setContent( metaData );
            metaData.__ctype = this._checkHtml(metaData.content) ? 'html' : 'canvas';
            this._setNodeSize( metaData );

            var fields = _.flatten([ metaData[ this.field ] ] );
            
            if( fields.length == 1 ){
                data.nodes.push( metaData );
            } else {
                data.edges.push( metaData );
            };
        };
        return data;
    }

    dagreLayout( data ){
        var me = this;

        var layout = global.layout.dagre;
        
        var g = new layout.graphlib.Graph();
        g.setGraph( this.layoutOpts.graph );
        g.setDefaultEdgeLabel(function() {
            //其实我到现在都还没搞明白setDefaultEdgeLabel的作用
            return {

            };
        });

        _.each( data.nodes, function( metaData ){
            var fields = _.flatten([ metaData[me.field] ] );
            _.extend( metaData, me.layoutOpts.edge );
            g.setNode( fields[0], metaData );
        } );
        _.each( data.edges, function( metaData ){
            var fields = _.flatten([ metaData[me.field] ] );
            _.extend( metaData, me.layoutOpts.edge );
            g.setEdge( fields[0], fields[1], metaData );
        } );

        layout.layout(g);

        data.size.width  = g.graph().width;
        data.size.height = g.graph().height;
        
        return data
    }

    widget(){
        var me = this;

        _.each( this.data.edges, function( edge ){
           
            var _bl = new Path({
                context : {
                    path : me._getPathStr( edge ),
                    lineWidth : 1,
                    strokeStyle : "#ccc"
                }
            });
            
            var _arrow = new Arrow({
                context: {
                    control : edge.points.slice(-2,-1)[0],
                    point : edge.points.slice(-1)[0],
                    strokeStyle : "#ccc"
                }
            });

            /*
            var _circle = new Circle({
                context : {
                    r : 4,
                    x : edge.x,
                    y : edge.y,
                    fillStyle: "red"
                }
            })
            me.edgesSp.addChild( _circle );
            */

            me.edgesSp.addChild( _arrow );
            me.edgesSp.addChild( _bl );

        } );
        _.each( this.data.nodes, function( node ){
            
            var _boxShape = new Rect({
                context: {
                    x : node.x - node.width/2,
                    y : node.y - node.height/2,
                    width : node.width,
                    height: node.height,
                    lineWidth: 1,
                    fillStyle: me.getProp( me.node.fillStyle ),
                    strokeStyle: me.getProp( me.node.strokeStyle ),
                    radius: _.flatten([ me.getProp( me.node.radius ) ])
                }
            });
            
            me.nodesSp.addChild( _boxShape );

            if( node.__ctype == "canvas" ){
                node.__element.context.x = node.x - node.width/2;
                node.__element.context.y = node.y - node.height/2;
                me.nodesSp.addChild( node.__element );
            };
            if( node.__ctype == "html" ){
                //html的话，要等 _boxShape 被添加进舞台，拥有了世界矩阵后才能被显示出来和移动位置
                //而且要监听 _boxShape 的任何形变跟随
                _boxShape.on("transform" , function(){
                    var devicePixelRatio = typeof (window) !== 'undefined' ? window.devicePixelRatio : 1;
                    node.__element.style.transform  = "matrix("+_boxShape.worldTransform.clone().scale(1/devicePixelRatio , 1/devicePixelRatio).toArray().join()+")";
                    node.__element.style.transformOrigin = "left top"; //修改为左上角为旋转中心点来和canvas同步
                    node.__element.style.marginLeft = me.getProp( me.node.padding ) * me.status.transform.scale +"px";
                    node.__element.style.marginTop  = me.getProp( me.node.padding ) * me.status.transform.scale +"px";
                    node.__element.style.visibility = "visible";
                });
                
            };
        } );

        this.induce.context.width = this.width;
        this.induce.context.height = this.height;

    }

    _getPathStr( edge ){
        var head = edge.points[0];
        var tail = edge.points.slice(-1)[0];
        var str = "M"+head.x+" "+head.y;
        str += ",Q"+edge.points[1].x+" "+ edge.points[1].y+" "+ tail.x+" "+ tail.y;
        //str += "z"
        return str;
    }
    /**
     * 字符串是否含有html标签的检测
     */
    _checkHtml( str ) {
        var  reg = /<[^>]+>/g;
        return reg.test( str );
    }

    _setContent( metaData ){
        var me = this;

        var _c; //this.node.content;
        if( this._isField( this.node.content.field ) ){
            _c = metaData[ this.node.content.field ];
        }
        if( _.isFunction( _c ) ){
            _c = this.content.apply( this, arguments );
        }
        if( me.node.content.format && _.isFunction( me.node.content.format ) ){
            _c = me.node.content.format( _c );
        }
        metaData.content = _c;
    }

    _isField( str ){
        return ~this.dataFrame.fields.indexOf( str )
    }

    _setNodeSize( metaData ){
        var me = this;
        var contentType = metaData.__ctype;

        if( me._isField( contentType ) ){
            contentType = metaData[ contentType ];
        };
        
        !contentType && (contentType = 'canvas');

        var _element;
        if( contentType == 'canvas' ){
            _element = me._getEleAndsetCanvasSize( metaData );
        };
        if( contentType == 'html' ){
            _element = me._getEleAndsetHtmlSize( metaData );
        };

        metaData.__element = _element;
    }


    _getEleAndsetCanvasSize( metaData ) {
        var me = this;
        var content = metaData.content;

        var sprite = new Canvax.Display.Sprite({});

        //先创建text，根据 text 来计算node需要的width和height
        var label = new Canvax.Display.Text( content , {
            context: {
                fillStyle    : me.getProp( me.node.content.fontColor ),
                textAlign    : me.getProp( me.node.content.textAlign ),
                textBaseline : me.getProp( me.node.content.textBaseline )
            }
        });

        if ( !metaData.width ) {
            metaData.width = label.getTextWidth() + me.getProp( me.node.padding ) * me.status.transform.scale * 2;
        };
        if ( !metaData.height ) {
            metaData.height = label.getTextHeight() + me.getProp( me.node.padding ) * me.status.transform.scale * 2;
        };

        sprite.addChild( label );

        sprite.context.width = parseInt( metaData.width );
        sprite.context.height = parseInt( metaData.height );
        label.context.x = parseInt( metaData.width / 2 );
        label.context.y = parseInt( metaData.height / 2 );

        return sprite;

    }

    _getEleAndsetHtmlSize( metaData ){
        var me = this;
        var content = metaData.content;

        var _tipDom = document.createElement("div");
        _tipDom.className = "chartx_relation_node";
        _tipDom.style.cssText += "; position:absolute;visibility:hidden;"
        _tipDom.style.cssText += "; color:"+me.getProp( me.node.content.fontColor )+";";
        _tipDom.style.cssText += "; text-align:"+me.getProp( me.node.content.textAlign )+";";
        _tipDom.style.cssText += "; vertical-align:"+me.getProp( me.node.content.textBaseline )+";";

        _tipDom.innerHTML = content;
        
        this.domContainer.appendChild( _tipDom );

        if ( !metaData.width ) {
            metaData.width = _tipDom.offsetWidth + me.getProp( me.node.padding ) * me.status.transform.scale * 2;
        };
        if ( !metaData.height ) {
            metaData.height = _tipDom.offsetHeight + me.getProp( me.node.padding ) * me.status.transform.scale * 2;
        };

        return _tipDom;

    }

    getNodesAt(index)
    {
        //该index指当前
        var data = this.data;
        
        var _nodesInfoList = []; //节点信息集合
        _.each( this.enabledField, function( fs, i ){
            if( _.isArray(fs) ){
                _.each( fs, function( _fs, ii ){
                    //fs的结构两层到顶了
                    var nodeData = data[ _fs ] ? data[ _fs ][ index ] : null;
                    nodeData && _nodesInfoList.push( nodeData );
                } );
            } else {
                var nodeData = data[ fs ] ? data[ fs ][ index ] : null;
                nodeData && _nodesInfoList.push( nodeData );
            }
        } );
        
        return _nodesInfoList;
    }

    getProp( prop, def ){
        return prop
    }

}