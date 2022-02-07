import Canvax from "canvax"
import {getPath,getDefaultProps} from "../../../utils/tools"
import { colorRgb } from "../../../utils/color"

let { _, event } = Canvax;
let AnimationFrame = Canvax.AnimationFrame;
let BrokenLine = Canvax.Shapes.BrokenLine;
let Circle = Canvax.Shapes.Circle;
let Isogon = Canvax.Shapes.Isogon;
let Rect = Canvax.Shapes.Rect;
let Path = Canvax.Shapes.Path;
 

export default class LineGraphsGroup extends event.Dispatcher
{
    static defaultProps(){
        return {
            line : {
                detail : '线配置',
                propertys : {
                    enabled : {
                        detail: '是否开启',
                        default: true
                    },
                    strokeStyle: {
                        detail: '线的颜色',
                        default: undefined //不会覆盖掉constructor中的定义
                    },
                    lineargradientDriction: {
                        detail: '线的填充色是渐变对象的话，这里用来描述方向，默认从上到下（topBottom）,可选leftRight',
                        default: 'topBottom' //可选 leftRight
                    },
                    lineWidth: {
                        detail: '线的宽度',
                        default: 2
                    },
                    lineType: {
                        detail: '线的样式',
                        default:'solid'
                    },
                    smooth: {
                        detail: '是否平滑处理',
                        default: true
                    }
                }
            },
            node : {
                detail: '单个数据节点配置，对应线上的小icon图形',
                propertys: {
                    enabled : {
                        detail: '是否开启',
                        default: true
                    },
                    shapeType: {
                        detail: '节点icon的图形类型，默认circle',
                        documentation: '可选有"isogon"(正多边形)，"path"（自定义path路径，待实现）',
                        default: 'circle'
                    },
                    isogonPointNum: {
                        detail: 'shapeType为"isogon"时有效，描述正多边形的边数',
                        default: 3
                    },
                    path: {
                        detail: 'shapeType为path的时候，描述图形的path路径',
                        default: null
                    },
                    corner: {
                        detail: '拐角才有节点',
                        default: false
                    },
                    radius: {
                        detail: '节点半径',
                        default: 3
                    },
                    fillStyle: {
                        detail: '节点图形的背景色',
                        default: null
                    },
                    strokeStyle: {
                        detail: '节点图形的描边色，默认和line.strokeStyle保持一致',
                        default: null
                    },
                    lineWidth: {
                        detail: '节点图形边宽大小',
                        default: 2
                    },
                    visible: {
                        detail: '节点是否显示,支持函数',
                        default: true
                    }
                }
            },
            label: {
                detail: '文本配置',
                propertys : {
                    enabled: {
                        detail: '是否开启',
                        default: false
                    },
                    fontColor: {
                        detail: '文本颜色',
                        default: null
                    },
                    strokeStyle: {
                        detail: '文本描边色',
                        default: null
                    },
                    fontSize: {
                        detail: '文本字体大小',
                        default: 12
                    },
                    format: {
                        detail: '文本格式化处理函数',
                        default: null
                    },
                    textAlign: {
                        detail: '水平布局方式',
                        default: 'center'
                    },
                    textBaseline: {
                        detail: '垂直布局方式',
                        default: 'bottom'
                    }
                }
            },
            area: {
                detail: '面积区域配置',
                propertys : {
                    enabled : {
                        detail: '是否开启',
                        default: true
                    },
                    lineargradientDriction: {
                        detail: '面积的填充色是渐变对象的话，这里用来描述方向，默认null(就会从line中取),从上到下（topBottom）,可选leftRight',
                        default: null //默认null（就会和line保持一致），可选 topBottom leftRight
                    },
                    fillStyle: {
                        detail: '面积背景色',
                        default: null
                    },
                    alpha: {
                        detail: '面积透明度',
                        default: 0.25
                    }
                }
            }
        }
    }

    constructor( fieldConfig, iGroup, opt, ctx, h, w , _graphs)
    {
        super();

        this._graphs = _graphs;

        this._opt = opt;
        this.fieldConfig = fieldConfig;
        this.field = null; //在extend之后要重新设置
        this.iGroup = iGroup;
        
        this._yAxis = fieldConfig.yAxis;
        
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.y = 0;

        this.data = []; 
        this.sprite = null;
        this.graphSprite = null; //line area放这里

        this._pointList = []; //brokenline最终的状态
        this._currPointList = []; //brokenline 动画中的当前状态
        this._bline = null;

        //设置默认的line.strokStyle 为 fieldConfig.color
        this.line = {
            strokeStyle : fieldConfig.color
        };

        _.extend(true, this, getDefaultProps( LineGraphsGroup.defaultProps() ), opt );

        //TODO group中得field不能直接用opt中得field， 必须重新设置， 
        //group中得field只有一个值，代表一条折线, 后面要扩展extend方法，可以控制过滤哪些key值不做extend
        this.field = fieldConfig.field; //iGroup 在yAxis.field中对应的值

        this.clipRect = null;

        this.__currFocusInd = -1;

        this.init(opt)
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite();
        this.graphSprite = new Canvax.Display.Sprite();
        this.sprite.addChild( this.graphSprite );

        //hover效果的node被添加到的容器
        this._focusNodes = new Canvax.Display.Sprite({});
        this.sprite.addChild(this._focusNodes);

        this._nodes = new Canvax.Display.Sprite({});
        this.sprite.addChild(this._nodes);

        this._labels = new Canvax.Display.Sprite({});
        this.sprite.addChild(this._labels);
    }

    draw(opt, data)
    {
        _.extend(true, this, opt);
        this.data = data;
        this._widget( opt );
    }


    //自我销毁
    destroy()
    {
        let me = this;
        me.sprite.animate({
            globalAlpha : 0
        } , {
            duration: 300,
            onComplete: function(){
                me.sprite.remove();
            }
        });
    }

    //styleType , normals , iGroup
    _getColor(s, iNode)
    {
        let color = this._getProp(s, iNode);
        if ( color === undefined || color === null ) {
            //这个时候可以先取线的style，和线保持一致
            color = this._getLineStrokeStyle();

            if( s && s.lineargradient ){
                color = s.lineargradient[ parseInt( s.lineargradient.length / 2 ) ].color
            };

            //因为_getLineStrokeStyle返回的可能是个渐变对象，所以要用isString过滤掉
            if( !color || !_.isString( color ) ){
                //那么最后，取this.fieldConfig.color
                color = this.fieldConfig.color; //this._getProp(this.color, iNode) //this.color会被写入到fieldMap.color
            }
        };
        return color;
    }

    _getProp(s, iNode)
    {
        if (_.isArray(s)) {
            return s[ this.iGroup ]
        };
        if (_.isFunction(s)) {
            let _nodesInfo = [];
            if( iNode != undefined ){
                _nodesInfo.push( this.data[ iNode ] );
            };
            return s.apply( this , _nodesInfo );
        };
        
        return s
    }


    //这个是tips需要用到的 
    getNodeInfoAt( $index, e )
    {
        let o = this.data[ $index ];
        if( e && e.eventInfo && e.eventInfo.dimension_1 ){
            let lt = e.eventInfo.dimension_1.layoutType;
            if( lt == 'proportion' ){
               //$index则代表的xpos，需要计算出来data中和$index最近的值作为 node
               let xDis;
               for( let i=0,l=this.data.length; i<l; i++ ){
                   let _node = this.data[i];
                   let _xDis = Math.abs(_node.x - $index);
                   if( xDis == undefined || _xDis < xDis ){
                       xDis = _xDis;
                       o = _node;
                       continue;
                   };
               };
            };
        };
        return o;
    }

    /**
     * 
     * @param {object} opt 
     * @param {data} data 
     * 
     * 触发这次reset的触发原因比如{name : 'datazoom', left:-1,right:1},  
     * dataTrigger 描述了数据变化的原因和变化的过程，比如上面的数据 left少了一个数据，right多了一个数据
     * @param {object} dataTrigger 
     */
    resetData(data, dataTrigger)
    {
       
        let me = this;

        if( data ){
            this.data = data;
        };

        me._pointList = this._getPointList( this.data );
        
        let plen = me._pointList.length;
        let cplen = me._currPointList.length;

        let params = {
            left : 0, //默认左边数据没变
            right : plen - cplen
        };
        if( dataTrigger ){
            _.extend( params, dataTrigger.params );
        };

        if( params.left ){
            if( params.left > 0 ){
                this._currPointList = this._pointList.slice(0, params.left ).concat( this._currPointList )
            }
            if( params.left < 0 ){
                this._currPointList.splice( 0, Math.abs( params.left ) );
            }
        };

        if( params.right ){
            if( params.right > 0 ){
                this._currPointList = this._currPointList.concat( this._pointList.slice( -params.right ) );
            }
            if( params.right < 0 ){
                this._currPointList.splice( this._currPointList.length - Math.abs( params.right ) );
            }
        };

        me._createNodes();
        me._createTexts();

        me._transition();
    }

    //数据变化后的切换动画
    _transition(callback)
    {
        let me = this;

        if( !me.data.length ){
            //因为在index中有调用
            callback && callback( me );
            return;
        };

        function _update( list ){

            if( !me._bline ){
                me.sprite._removeTween( me._transitionTween );
                me._transitionTween = null;
                return;
            }
            
            if( me._bline.context ){
                me._bline.context.pointList = _.clone( list );
                me._bline.context.strokeStyle = me._getLineStrokeStyle();
            }
            
            if( me._area.context ){
                me._area.context.path = me._fillLine(me._bline);
                me._area.context.fillStyle = me._getFillStyle();
            }

            let iNode=0;
            _.each( list, function( point, i ){
                if( _.isNumber( point[1] ) ){
                    if( me._nodes ){
                        let _node = me._nodes.getChildAt(iNode);
                        if( _node ){
                            _node.context.x = point[0];
                            _node.context.y = point[1];
                        }
                    }
                    if( me._labels ){
                        let _text = me._labels.getChildAt(iNode);
                        if( _text ){
                            _text.context.x = point[0];
                            _text.context.y = point[1] - 3 - 3;
                            me._checkTextPos( _text , i );
                        }
                    }
                    iNode++;
                }
            } );
        };


        this._transitionTween = AnimationFrame.registTween({
            from: me._getPointPosStr(me._currPointList),
            to: me._getPointPosStr(me._pointList),
            desc: me.field,
            onUpdate: function( arg ) {
                for (let p in arg) {
                    let ind = parseInt(p.split("_")[2]);
                    let xory = parseInt(p.split("_")[1]);
                    me._currPointList[ind] && (me._currPointList[ind][xory] = arg[p]); //p_1_n中间的1代表x or y
                };
                _update( me._currPointList );
            },
            onComplete: function() {
                
                me.sprite._removeTween( me._transitionTween );

                me._transitionTween = null;
                //在动画结束后强制把目标状态绘制一次。
                //解决在onUpdate中可能出现的异常会导致绘制有问题。
                //这样的话，至少最后的结果会是对的。
                _update( me._pointList );
                callback && callback( me );
            }
        });

        this.sprite._tweens.push( this._transitionTween );
    }

    //首次加载的进场动画
    _grow(callback){
        let _coord = this._graphs.app.getCoord();
        let {width,height} = _coord;
        this.clipRect = new Rect({
            context : {
                x: 0, //-100,
                y: -height,
                width:0,
                height,
                fillStyle: 'blue'
            }
        });

        let growTo = { width : width }

        this.graphSprite.clipTo( this.clipRect );
        if( this.yAxisAlign == 'right' ){
            this.clipRect.context.x = width;
            growTo.x = 0;
        };

        //TODO：理论上下面这句应该可以神略了才行
        this.sprite.addChild( this.clipRect );

        this.clipRect.animate( growTo , {
            duration: this._graphs.aniDuration,
            onUpdate: ()=>{

                let clipRectCtx = this.clipRect.context
                this._nodes.children.concat( this._labels.children ).forEach(el => {
                    let _ctx = el.context;
                    if( _ctx.globalAlpha == 0 && _ctx.x>=clipRectCtx.x && _ctx.x<=clipRectCtx.x+clipRectCtx.width){
                        el.animate({
                            globalAlpha: 1
                        },{
                            duration:300
                        });
                    }
                });
                
                
            },
            onComplete: ()=>{
                callback && callback()
            }
        });
    }

    _getPointPosStr(list)
    {
        let obj = {};
        _.each(list, function(p, i) {
            if( !p ){
                //折线图中这个节点可能没有
                return;
            };

            obj["p_1_" + i] = p[1]; //p_y==p_1
            obj["p_0_" + i] = p[0]; //p_x==p_0
        });
        return obj;
    }

    _getPointList(data)
    {
        let list = [];
        for (let a = 0, al = data.length; a < al; a++) {
            let o = data[a];
            list.push([
                o.x,
                o.y
            ]);
        };
        return list;
    }

    _widget( opt )
    {
        let me = this;
        !opt && (opt ={});
        
        me._pointList = this._getPointList(me.data);

        if (me._pointList.length == 0) {
            //filter后，data可能length==0
            return;
        };

        // change log 入场动画修改为了从左到右的剪切显示
        // let list = [];
        // if (opt.animation) {
        //     let firstNode = this._getFirstNode();
        //     let firstY = firstNode ? firstNode.y : undefined;
        //     for (let a = 0, al = me.data.length; a < al; a++) {
        //         let o = me.data[a];
        //         list.push([
        //             o.x,
        //             _.isNumber( o.y ) ? firstY : o.y
        //         ]);
        //     };
        // } else {
        //     list = me._pointList;
        // };

        let list = me._pointList;
        
        me._currPointList = list;

        let blineCtx = {
            pointList: list,
            lineWidth: me.line.lineWidth,
            y: me.y,
            strokeStyle : me._getLineStrokeStyle( list ), //_getLineStrokeStyle 在配置线性渐变的情况下会需要
            smooth: me.line.smooth,
            lineType: me._getProp(me.line.lineType),
            smoothFilter: function(rp) {
                //smooth为true的话，折线图需要对折线做一些纠正，不能超过底部
                if (rp[1] > 0) {
                    rp[1] = 0;
                } else if( Math.abs(rp[1]) > me.h ) {
                    rp[1] = -me.h;
                }
            },
            lineCap: "round"
        };
        let bline = new BrokenLine({ //线条
            context: blineCtx
        });

        bline.on( event.types.get() , function (e) {
            e.eventInfo = {
                trigger : me.line,
                nodes   : []
            };
            me._graphs.app.fire( e.type, e );
        });

        if (!this.line.enabled) {
            bline.context.visible = false
        };
        me.graphSprite.addChild(bline);
        me._bline = bline;

        let area = new Path({ //填充
            context: {
                path: me._fillLine(bline),
                fillStyle: me._getFillStyle(), 
                globalAlpha: _.isArray(me.area.alpha) ? 1 : me.area.alpha
            }
        });
        area.on( event.types.get() , function (e) {
            e.eventInfo = {
                trigger : me.area,
                nodes   : []
            };
            me._graphs.app.fire( e.type, e );
        });

        if( !this.area.enabled ){
            area.context.visible = false
        };
        me.graphSprite.addChild(area);
        me._area = area;

        me._createNodes( opt );
        me._createTexts( opt );
    }

    _getFirstNode()
    {
        let _firstNode = null;
        for( let i=0,l=this.data.length; i<l; i++ ){
            let nodeData = this.data[i];
            if( _.isNumber( nodeData.y ) ){
                if( _firstNode === null || ( this.yAxisAlign == "right" ) ){
                    //_yAxis为右轴的话，
                    _firstNode = nodeData;
                }
                if( this.yAxisAlign !== "right" && _firstNode !== null ){
                    break;
                }
            };
        } 
        
        return _firstNode;    
    }

    _getFillStyle()
    {
        let me = this;
    
        let fill_gradient = null;

        // _fillStyle 可以 接受渐变色，可以不用_getColor， _getColor会过滤掉渐变色
        let _fillStyle = me._getProp(me.area.fillStyle) || me._getLineStrokeStyle( null, "area" );

        if (_.isArray(me.area.alpha) && !(_fillStyle instanceof CanvasGradient)) {
            //alpha如果是数组，那么就是渐变背景，那么就至少要有两个值
            //如果拿回来的style已经是个gradient了，那么就不管了
            me.area.alpha.length = 2;
            if (me.area.alpha[0] == undefined) {
                me.area.alpha[0] = 0;
            };
            if (me.area.alpha[1] == undefined) {
                me.area.alpha[1] = 0;
            };

            let lps = this._getLinearGradientPoints( 'area' );
            if(!lps) return;

            //创建一个线性渐变
            fill_gradient = me.ctx.createLinearGradient( ...lps );

            let rgb = colorRgb( _fillStyle );
            let rgba0 = rgb.replace(')', ', ' + me._getProp(me.area.alpha[0]) + ')').replace('RGB', 'RGBA');
            fill_gradient.addColorStop(0, rgba0);

            let rgba1 = rgb.replace(')', ', ' + me.area.alpha[1] + ')').replace('RGB', 'RGBA');
            fill_gradient.addColorStop(1, rgba1);

            _fillStyle = fill_gradient;
        };
    
        return _fillStyle;
    }

    _getLineStrokeStyle( pointList, graphType='line' )
    {
        let me = this;
        let _style
        if( !this._opt.line || !this._opt.line.strokeStyle ){
            //如果用户没有配置line.strokeStyle，那么就用默认的
            return this.line.strokeStyle;
        };

        let lineargradient = this._opt.line.strokeStyle.lineargradient;
        if( lineargradient ){

            //如果是右轴的话，渐变色要对应的反转
            if( this.yAxisAlign == 'right' ){
                lineargradient = lineargradient.reverse();
            };

            //如果用户配置 填充是一个线性渐变
            let lps = this._getLinearGradientPoints( graphType, pointList );
            if( !lps ) return;

            _style = me.ctx.createLinearGradient( ...lps );
            _.each( lineargradient , function( item ){
                _style.addColorStop( item.position , item.color);
            });

            return _style;

        } else {
            _style = this._getColor( this._opt.line.strokeStyle );
            return _style;
        }
        
    }

    _getLinearGradientPoints( graphType='line', pointList ){

        //如果graphType 传入的是area，并且，用户并没有配area.lineargradientDriction,那么就会默认和line.lineargradientDriction对齐
        let driction = this[ graphType ].lineargradientDriction || this.line.lineargradientDriction;
        
        !pointList && ( pointList = this._bline.context.pointList );

        let linearPointStart,linearPointEnd;

        if( driction == 'topBottom' ){
            //top -> bottom
            let topX=0,topY=0,bottomX=0,bottomY=0;
            for( let i=0,l=pointList.length; i<l; i++ ){
                let point = pointList[i];
                let y = point[1];
                if( !isNaN(y) ){
                    topY = Math.min( y, topY );
                    bottomY = Math.max( y, bottomY );
                }
            }

            linearPointStart = {
                x: topX,
                y: topY
            }
            linearPointEnd= {
                x: bottomX,
                y: bottomY
            }

            if( graphType == 'area' ){
                //面积图的话，默认就需要一致绘制到底的x轴位置去了
                linearPointEnd.y = 0;
            }

        } else {
            //left->right
            
            let leftX,rightX,leftY=0,rightY=0;
            for( let i=0,l= pointList.length; i<l; i++ ){
                let point = pointList[i];
                let x = point[0];
                let y = point[1];
                if(!isNaN(x) && !isNaN(y)){
                    if( leftX == undefined ){
                        leftX  = x;
                    } else {
                        leftX  = Math.min( x, leftX );
                    }
                    rightX = Math.max( x, leftX );
                }
            };
            linearPointStart = {
                x: leftX,
                y: leftY
            }
            linearPointEnd= {
                x: rightX,
                y: rightY
            }

        }

        if( linearPointStart.x == undefined || linearPointStart.y == undefined || linearPointEnd.x==undefined || linearPointEnd.y == undefined){
            return null;
        }

        return [
            linearPointStart.x, linearPointStart.y, 
            linearPointEnd.x, linearPointEnd.y
        ]
    }

    _createNodes( opt={} )
    {
        
        let me = this;
        let list = me._currPointList;

        let iNode = 0; //这里不能和下面的a对等，以为list中有很多无效的节点
        for (let a = 0, al = list.length; a < al; a++) {

            let _nodeColor = me._getColor( (me.node.strokeStyle || me.color || me.line.strokeStyle), a );
            me.data[a].color = _nodeColor; //回写回data里，tips的是用的到

            let nodeEnabled = me.node.enabled;
            if( list.length == 1 && !nodeEnabled ){
                nodeEnabled = true; //只有一个数据的时候， 强制显示node
            }
            // if( !nodeEnabled ){
            //     //不能写return， 是因为每个data的color还是需要计算一遍
            //     continue;
            // };

            let _point = me._currPointList[a];
            if( !_point || !_.isNumber( _point[1] ) ){
                //折线图中有可能这个point为undefined
                continue;
            };

            let x = _point[0];
            let y = _point[1];
            let globalAlpha = opt.isResize ? 1 : 0;
            if( this.clipRect && !opt.isResize ){
                let clipRectCtx = this.clipRect.context;
                if( x >= clipRectCtx.x && x<= clipRectCtx.x+clipRectCtx.width ){
                    globalAlpha = 1;
                }
            };

            let context = {
                x,y,
                r: me._getProp(me.node.radius, a),
                lineWidth: me._getProp(me.node.lineWidth, a) || 2,
                strokeStyle: _nodeColor,
                fillStyle: me._getProp(me.node.fillStyle, a) || _nodeColor,
                visible : nodeEnabled && !!me._getProp(me.node.visible, a),
                globalAlpha
            };

            

            let nodeConstructor = Circle;

            let _shapeType = me._getProp(me.node.shapeType, a)

            if( _shapeType == "isogon" ){
                nodeConstructor = Isogon;
                context.n = me._getProp(me.node.isogonPointNum, a);
            };
            if( _shapeType == "path" ){
                nodeConstructor = Path;
                context.path = me._getProp( me.node.path, a );
            };

            let nodeEl = me._nodes.children[ iNode ];

            //同一个元素，才能直接extend context
            if( nodeEl ){
                if( nodeEl.type == _shapeType ){
                    _.extend( nodeEl.context , context );
                } else {
                    nodeEl.destroy();

                    //重新创建一个新的元素放到相同位置
                    nodeEl = new nodeConstructor({
                        context: context
                    });
                    me._nodes.addChildAt(nodeEl, iNode);
                };
            } else {
                nodeEl = new nodeConstructor({
                    context: context
                });
                me._nodes.addChild(nodeEl);
            };
                
            if ( me.node.corner ) { //拐角才有节点
                let y = me._pointList[a][1];
                let pre = me._pointList[a - 1];
                let next = me._pointList[a + 1];
                if (pre && next) {
                    if (y == pre[1] && y == next[1]) {
                        nodeEl.context.visible = false;
                    }
                }
            };

            me.data[a].nodeEl = nodeEl;

            iNode++;
        };

        //把过多的节点删除了
        if( me._nodes.children.length > iNode ){
            for( let i = iNode,l=me._nodes.children.length; i<l; i++ ){
                me._nodes.children[i].destroy();
                i--;
                l--;
            }
        };
       
    }

    _createTexts(opt={})
    {
        
        let me = this;
        let list = me._currPointList;

        let _coord = this._graphs.app.getCoord();

        if ( me.label.enabled ) { //节点上面的文本info
            
            let iNode = 0; //这里不能和下面的a对等，以为list中有很多无效的节点
            for (let a = 0, al = list.length; a < al; a++) {
                let _point = list[a];
                if( !_point || !_.isNumber( _point[1] ) ){
                    //折线图中有可能这个point为undefined
                    continue;
                };

                let x = _point[0];
                let y = _point[1] - this.node.radius - 2;
                let globalAlpha = opt.isResize ? 1 : 0;
                if( this.clipRect && !opt.isResize ){
                    let clipRectCtx = this.clipRect.context;
                    if( x >= clipRectCtx.x && x<= clipRectCtx.x+clipRectCtx.width ){
                        globalAlpha = 1;
                    }
                };

                let context = {
                    x, y,
                    fontSize: this.label.fontSize,
                    textAlign: this.label.textAlign,
                    textBaseline: this.label.textBaseline,
                    fillStyle: me._getColor( me.label.fontColor, a ),
                    lineWidth:1,
                    strokeStyle:"#ffffff",
                    globalAlpha
                };

                let value = me.data[ a ].value;
                if (_.isFunction(me.label.format)) {
                    //如果有单独给label配置format，就用label上面的配置
                    value = (me.label.format(value, me.data[ a ]) || value );
                } else {
                    //否则用fieldConfig上面的
                    let fieldConfig = _coord.getFieldConfig( this.field );
                    value = fieldConfig.getFormatValue( value );
                };
                if( value == undefined || value == null ){
                    continue;
                };

                let _label = this._labels.children[ iNode ];
                if( _label ){
                    _label.resetText( value );
                    _.extend( _label.context, context );
                } else {
                    _label =  new Canvax.Display.Text( value , {
                        context: context
                    });
                    me._labels.addChild(_label);
                    me._checkTextPos( _label , a );
                }
                iNode++;
            };

            //把过多的label节点删除了
            if( me._labels.children.length > iNode ){
                for( let i = iNode,l=me._labels.children.length; i<l; i++ ){
                    me._labels.children[i].destroy();
                    i--;
                    l--;
                }
            };            
        };
        
    }

    _checkTextPos( _label , ind )
    {
        let me = this;
        let list = me._currPointList;
        let pre = list[ ind - 1 ];
        let next = list[ ind + 1 ];

        if( 
            pre && next &&
            ( pre[1] < _label.context.y && next[1] < _label.context.y )
         ){
            _label.context.y += 12;
            _label.context.textBaseline = "top"
        }
      
    }

    _fillLine(bline)
    { //填充直线
        let fillPath = _.clone(bline.context.pointList);

        let path = "";
        
        let originPos = -this._yAxis.originPos;

        let _currPath = null;


        _.each( fillPath, function( point, i ){
            if( _.isNumber( point[1] ) ){
                if( _currPath === null ){
                    _currPath = [];
                }
                _currPath.push( point );
            } else {
                // not a number
                if( _currPath && _currPath.length ){
                    getOnePath()
                };
            }

            if( i == fillPath.length-1 &&  _.isNumber( point[1] )){
                getOnePath();
            }

        } );

        function getOnePath(){
            _currPath.push(
                [_currPath[_currPath.length - 1][0], originPos], [_currPath[0][0], originPos], [_currPath[0][0], _currPath[0][1]]
            );
            path += getPath( _currPath );
            _currPath = null;
        }

        return path;
    }

    //根据x方向的 val来 获取对应的node， 这个node可能刚好是一个node， 也可能两个node中间的某个位置
    getNodeInfoOfX( x ){
        let me = this;
        let nodeInfo;
        for( let i = 0,l = this.data.length; i<l; i++ ){
            if( this.data[i].value !== null && Math.abs( this.data[i].x - x) <= 1 ){
                //左右相差不到1px的，都算
                nodeInfo = this.data[ i ];
                return nodeInfo;
            }
        };

        let getPointFromXInLine = function( x , line ){
            let p = {x : x, y: 0};
            p.y = line[0][1] + ((line[1][1]-line[0][1])/(line[1][0]-line[0][0])) * (x - line[0][0]);
            return p;
        };

        let point;
        let search = function( points ){

            if( x<points[0][0] || x>points.slice(-1)[0][0] ){
                return;
            };

            let midInd = parseInt(points.length / 2);
            if( Math.abs(points[midInd][0] - x ) <= 1 ){
                point = {
                    x: points[midInd][0],
                    y: points[midInd][1]
                };
                return;
            };
            let _pl = [];
            if( x > points[midInd][0] ){
                if( x < points[midInd+1][0]){
                    point = getPointFromXInLine( x , [ points[midInd] , points[midInd+1] ] );
                    return;
                } else {
                    _pl = points.slice( midInd+1 );
                }
            } else {
                if( x > points[midInd-1][0] ){
                    point = getPointFromXInLine( x , [ points[midInd-1] , points[midInd] ] );
                    return;
                } else {
                    _pl = points.slice( 0 , midInd );
                }
            };
            search(_pl);

        };
        
        this._bline && search( this._bline.context.pointList );
        
        if( !point || point.y == undefined ){
            return null;
        };

        //和data 中数据的格式保持一致

        let node = {
            type    : "line",
            iGroup  : me.iGroup,
            iNode   : -1, //并非data中的数据，而是计算出来的数据
            field   : me.field,
            value   : this._yAxis.getValOfPos( -point.y ),
            x       : point.x,
            y       : point.y,
            rowData : null, //非data中的数据，没有rowData
            color   : me._getProp( me.node.strokeStyle ) || me._getLineStrokeStyle()
        };

        return node;
    }


    tipsPointerOf( e )
    {
        if( e.eventInfo ){
            let iNode = e.eventInfo.iNode;
            if( iNode != this.__currFocusInd && this.__currFocusInd != -1 ){
                this.unfocusOf( this.__currFocusInd );
            };
            this.focusOf( e.eventInfo.iNode );
        }
    }
    tipsPointerHideOf( e )
    {
        if( e.eventInfo ){
            this.unfocusOf( e.eventInfo.iNode );
        }
    }

    focusOf( iNode )
    {

        let node = this.data[ iNode ];

        if(node){
            let _node = node.nodeEl;
      
            if( _node && !node.focused && this.__currFocusInd != iNode ){
    
                //console.log( 'focusOf' )
    
                _node._fillStyle = _node.context.fillStyle;
                _node.context.fillStyle = 'white';
                _node._visible = _node.context.visible;
                _node.context.visible = true;
    
    
    
                let _focusNode = _node.clone();
                this._focusNodes.addChild( _focusNode );
    
                //_focusNode.context.r += 6;
                _focusNode.context.visible = true;
                _focusNode.context.lineWidth = 0; //不需要描边
                _focusNode.context.fillStyle = _node.context.strokeStyle;
                _focusNode.context.globalAlpha = 0.5;
    
                _focusNode.animate({
                    r : _focusNode.context.r + 6
                }, {
                    duration: 300
                })
    
                this.__currFocusInd = iNode;
            }
            node.focused = true;
        }

    }
    unfocusOf( iNode )
    {
        if( this.__currFocusInd > -1 ){
            iNode = this.__currFocusInd;
        };

        let node = this.data[ iNode ];

        if( node ){
            this._focusNodes.removeAllChildren();

            let _node = node.nodeEl;
    
            if( _node && node.focused ){
                //console.log('unfocus')
                _node.context.fillStyle = _node._fillStyle;
                _node.context.visible = _node._visible;
                node.focused = false;
                this.__currFocusInd = -1;
            };
        }

    }
}