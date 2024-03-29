import Canvax from "canvax"
import {getDefaultProps} from "../../../utils/tools"
import { colorIsHex,colorRgba } from "../../../utils/color"
import numeral from "numeral"

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
            aniDuration: { //覆盖基类中的设置，line的duration要1000
                detail: '动画时长',
                default: 1000
            },
            line : {
                detail : '线配置',
                propertys : {
                    enabled : {
                        detail: '是否开启',
                        default: true
                    },
                    growDriction:{
                        detail: '生长动画的方向，默认为从左到右（leftRgiht）,可选rightLeft',
                        default: 'leftRight'
                    },
                    strokeStyle: {
                        detail: '线的颜色',
                        default: undefined //不会覆盖掉constructor中的定义
                    },
                    lineargradientDriction: {
                        detail: '线的填充色是渐变对象的话，这里用来描述方向，默认从上到下（topBottom）,可选leftRight',
                        default: 'leftRight' //可选 topBottom
                    },
                    lineWidth: {
                        detail: '线的宽度',
                        default: 2
                    },
                    lineType: {
                        detail: '线的样式',
                        default:'solid'
                    },
                    lineDash: {
                        detail: '虚线的线段样式，默认[6,3]',
                        default: [2,5]
                    },
                    smooth: {
                        detail: '是否平滑处理',
                        default: true
                    },
                    shadowOffsetX: {
                        detail: '折线的X方向阴影偏移量',
                        default: 0
                    },
                    shadowOffsetY: {
                        detail: '折线的Y方向阴影偏移量',
                        default: 2
                    },
                    shadowBlur: {
                        detail: '折线的阴影模糊效果',
                        default: 8
                    },
                    shadowColor: {
                        detail: '折线的阴影颜色，默认和折线的strokeStyle同步， 如果strokeStyle是一个渐变色，那么shadowColor就会失效，变成默认的黑色，需要手动设置该shadowColor',
                        default: function () {
                            var fieldColor = this.color;
                            return colorRgba(fieldColor, 0.4);
                        }
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
                        detail: '节点图形边宽大小,默认跟随line.lineWidth',
                        default: null
                    },
                    visible: {
                        detail: '节点是否显示,支持函数',
                        default: true
                    },
                    focus: {
                        detail: "节点hover态设置",
                        propertys: {
                            radiusDiff: {
                                detail: 'hover后的背景节点半径相差，正数为变大值,默认为4',
                                default: 4
                            },
                            alpha: {
                                detail: 'hover后的背景节点透明度，默认为0.5',
                                default: 0.5
                            }
                        }
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
                        default: 'topBottom' //默认null（就会和line保持一致），可选 topBottom leftRight
                    },
                    fillStyle: {
                        detail: '面积背景色',
                        default: null
                    },
                    alpha: {
                        detail: '面积透明度',
                        default: 0.5
                    },
                    bottomLine: {
                        detail: 'area的底部线配置',
                        propertys : {
                            enabled : {
                                detail: '是否开启',
                                default: true
                            }
                        }
                    }
                }
            }
        }
    }

    constructor( fieldConfig, iGroup, opt, ctx, h, w , _graphs, bottomFieldMap={})
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

        this._pointList = []; //brokenline最终的状态
        this._currPointList = []; //brokenline 动画中的当前状态
        this._line = null;

        this._bottomPointList = []; // bottomLine的最终状态
        this._currBottomPointList = []; // bottomLine 动画中的当前状态
        this._bottomLine = null;

        //设置默认的color 为 fieldConfig.color
        this.color = fieldConfig.color;

        _.extend(true, this, getDefaultProps( LineGraphsGroup.defaultProps() ), opt );

        //TODO group中得field不能直接用opt中得field， 必须重新设置， 
        //group中得field只有一个值，代表一条折线, 后面要扩展extend方法，可以控制过滤哪些key值不做extend
        this.field = fieldConfig.field; //iGroup 在yAxis.field中对应的值

        this.clipRect = null;

        this.__currFocusInd = -1;

        this._growed = false;

        //_bottomField如果有， 那么在画area的时候起点是_bottomField上面的值，而不是从默认的坐标0开始
        this._bottomField = bottomFieldMap[ this.field ];
        
        this.init(opt)
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite();
        this.graphSprite = new Canvax.Display.Sprite();
        this.sprite.addChild( this.graphSprite );

        this.lineSprite = new Canvax.Display.Sprite();
        this.graphSprite.addChild( this.lineSprite );
        
        //hover效果的node被添加到的容器
        this._focusNodes = new Canvax.Display.Sprite({});
        this.sprite.addChild(this._focusNodes);

        this._nodes = new Canvax.Display.Sprite({});
        this.sprite.addChild(this._nodes);

        this._labels = new Canvax.Display.Sprite({});
        this.sprite.addChild(this._labels);
    }

    _clean(){
        this.lineSprite.removeAllChildren();
        this._focusNodes.removeAllChildren();
        this._nodes.removeAllChildren();
        this._labels.removeAllChildren();
        this._line = null;
        this._bottomLine = null;
        this._area = null;
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

        //只有iNode有传数据的时候（ 获取node的color 或者 获取 label的color ），才做如下处理
        if ( arguments.length > 1 && (color === undefined || color === null )) {

            if( s && s.lineargradient ){
                color = s.lineargradient[ parseInt( s.lineargradient.length / 2 ) ].color
            };

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
    resetData(data, dataTrigger, opt)
    {
        
        let me = this; 
        if( data ){
            this.data = data;
        };

        if( !dataTrigger || !dataTrigger.comp ){
            //如果是系统级别的调用，需要从新执行绘制, 不是内部的触发比如（datazoom）
            me._growed = false;
            if(me.clipRect){
                me.clipRect.destroy();
                me.clipRect = null;
            };
            me._widget( this );
            me._grow();
        } else {

            me._pointList = this._getPointList( this.data );
            me._bottomPointList = this._getBottomPointList();
    
            let plen = me._pointList.length;
            let cplen = me._currPointList.length;

            let params = {
                left : 0, //默认左边数据没变
                right : plen - cplen
            };
            if( dataTrigger && dataTrigger.params ){
                _.extend( params, dataTrigger.params );
            };

            if( params.left ){
                if( params.left > 0 ){
                    this._currPointList = this._pointList.slice(0, params.left ).concat( this._currPointList );
                    if( this._bottomField ){
                        this._currBottomPointList = this._bottomPointList.slice(0, params.left ).concat( this._currBottomPointList );
                    }
                }
                if( params.left < 0 ){
                    this._currPointList.splice( 0, Math.abs( params.left ) );
                    if( this._bottomField ){
                        this._currBottomPointList.splice( 0, Math.abs( params.left ) );
                    }
                }
            };
 
            if( params.right ){
                if( params.right > 0 ){
                    this._currPointList = this._currPointList.concat( this._pointList.slice( -params.right ) );
                    if( this._bottomField ){
                        this._currBottomPointList = this._currBottomPointList.concat( this._bottomPointList.slice( -params.right ) );
                    }
                }
                if( params.right < 0 ){
                    this._currPointList.splice( this._currPointList.length - Math.abs( params.right ) );
                    if( this._bottomField ){
                        this._currBottomPointList.splice( this._currBottomPointList.length - Math.abs( params.right ) );
                    }
                }
            };

            me._createNodes();
            me._createTexts();
            me._transition();
        }
    }

    //数据变化后的切换动画
    _transition(callback)
    {
        
        let me = this;

        if( !me.data.length ){
            //因为在index中有调用
            if( me._line.context ){
                me._line.context.pointList = [];
            };
            if( me._bottomLine.context ){
                me._bottomLine.context.pointList = [];
            };
            if( me._area && me._area.context ){
                me._area.context.path = '';
            };
            callback && callback( me );
            return;
        };

        function _update( pointList, bottomPointList ){

            if( !me._line ){
                me.sprite._removeTween( me._transitionTween );
                me._transitionTween = null;
                return;
            }
            
            let _strokeStyle = me._getLineStrokeStyle();;
            if( me._line.context ){
                me._line.context.pointList = _.clone( pointList );
                me._line.context.strokeStyle = _strokeStyle;
            }

            if( me._bottomField && me._bottomLine && me._bottomLine.context ){
                me._bottomLine.context.pointList = _.clone( bottomPointList );
                me._bottomLine.context.strokeStyle = _strokeStyle
            }
            
            if( me._area && me._area.context ){
                me._area.context.path = me._getFillPath(me._line, me._bottomLine);
                me._area.context.fillStyle = me._getFillStyle();
            }

            let iNode=0;
            _.each( pointList, function( point, i ){
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

        if( !this._growed ){
            //如果还在入场中
            me._currPointList = me._pointList;
            me._currBottomPointList = me._bottomPointList;
            _update( me._currPointList, me._currBottomPointList );
            return;
        }

        this._transitionTween = AnimationFrame.registTween({
            from: me._getPointPosStr(me._currPointList, me._currBottomPointList),
            to: me._getPointPosStr(me._pointList, me._bottomPointList),
            desc: me.field,
            onUpdate: function( arg ) {
                for (let p in arg) {
                    let currPointerList = p.split("_")[0] == 'p' ? me._currPointList : me._currBottomPointList
                    let ind = parseInt(p.split("_")[2]);
                    let xory = parseInt(p.split("_")[1]);
                    currPointerList[ind] && (currPointerList[ind][xory] = arg[p]); //p_1_n中间的1代表x or y
                };
                _update( me._currPointList , me._currBottomPointList);
            },
            onComplete: function() {
                
                me.sprite._removeTween( me._transitionTween );

                me._transitionTween = null;
                //在动画结束后强制把目标状态绘制一次。
                //解决在onUpdate中可能出现的异常会导致绘制有问题。
                //这样的话，至少最后的结果会是对的。
                _update( me._pointList, me._bottomPointList );
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
                y: -height-3,
                width:0,
                height:height+6,
                fillStyle: 'green'
            }
        });

        let growTo = { width : width }

        this.lineSprite.clipTo( this.clipRect );
        this.graphSprite.addChild( this.clipRect );
        
        if( this.line.growDriction == 'rightLeft' ){
            this.clipRect.context.x = width;
            growTo.x = 0;
        };

        this.clipRect.animate( growTo , {
            duration: this._graphs.aniDuration,
            easing: this.aniEasing,
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
                this._growed = true;
                callback && callback()
            }
        });
    }

    _getPointPosStr(pointList, bottomPointList)
    {
        let obj = {};
        pointList.forEach((p,i) => {
            if( !p ){
                //折线图中这个节点可能没有
                return;
            };
            obj["p_1_" + i] = p[1]; //p_y==p_1
            obj["p_0_" + i] = p[0]; //p_x==p_0
        });
        bottomPointList.forEach((p,i) => {
            if( !p ){
                //折线图中这个节点可能没有
                return;
            };
            obj["bp_1_" + i] = p[1]; //p_y==p_1
            obj["bp_0_" + i] = p[0]; //p_x==p_0
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

        if( opt.isResize ){
            me._growed = true;
        };

        //绘制之前先自清空
        me._clean();
        
        me._pointList = this._getPointList(me.data);

        if (me._pointList.length == 0) {
            //filter后，data可能length==0
            return;
        };

        let list = me._pointList;
        
        me._currPointList = list;

        let strokeStyle = me._getLineStrokeStyle( list ); //在配置线性渐变的情况下会需要

        let blineCtx = {
            pointList: list,
            lineWidth: me.line.lineWidth,
            y: me.y,
            strokeStyle, 
            smooth: me.line.smooth,
            lineType: me._getProp( me.line.lineType ),
            lineDash: me.line.lineDash, //TODO: 不能用_getProp
            lineJoin: 'bevel',
            lineCap: "round"
        };

        if( me.line.shadowBlur ){
            blineCtx.shadowBlur = me._getProp(me.line.shadowBlur);
            blineCtx.shadowColor = me._getProp(me.line.shadowColor) || strokeStyle;
            blineCtx.shadowOffsetY = me._getProp(me.line.shadowOffsetY)
            blineCtx.shadowOffsetX = me._getProp(me.line.shadowOffsetX)
        };

        let bline = new BrokenLine({ //线条
            context: blineCtx
        });

        bline.on( event.types.get() , function (e) {
            e.eventInfo = {
                trigger : 'this.line',
                nodes   : []
            };
            me._graphs.app.fire( e.type, e );
        });

        if (!this.line.enabled) {
            bline.context.visible = false
        };
        me.lineSprite.addChild(bline);
        me._line = bline;
        
        
        if( me.area.enabled ){

            if( this._bottomField ){
                //如果有 _bottomField
                me._bottomPointList = this._getBottomPointList();

                let _list = me._bottomPointList;
                me._currBottomPointList = _list;
                
                let bottomLineCtx = {};
                Object.assign(bottomLineCtx, blineCtx);
                bottomLineCtx.pointList = me._bottomPointList;
                let bottomLine = new BrokenLine({ //线条
                    context: bottomLineCtx
                });
                if (!this.area.bottomLine.enabled) {
                    bottomLine.context.visible = false
                };
                me.lineSprite.addChild(bottomLine);
                me._bottomLine = bottomLine;
                
            }

            let area = new Path({ //填充
                context: {
                    path: me._getFillPath(me._line, me._bottomLine),
                    fillStyle: me._getFillStyle(), 
                    globalAlpha: me.area.alpha
                }
            });
            area.on( event.types.get() , function (e) {
                e.eventInfo = {
                    trigger : 'this.area',//me.area,
                    nodes   : []
                };
                me._graphs.app.fire( e.type, e );
            });

            me.lineSprite.addChild(area);
            me._area = area;
        }

        me._createNodes( opt );
        me._createTexts( opt );
    }

    _getBottomPointList(){

        if( !this._bottomField ) return [];

        let _coord = this._graphs.app.getCoord();
        let bottomData = this._graphs.dataFrame.getFieldData(  this._bottomField );
        this._yAxis.addValToSection( bottomData ); //把bottomData的数据也同步到y轴的dataSection, 可能y轴需要更新

        let _bottomPointList = [];
        bottomData.forEach( (item,i) => {
            let point = _coord.getPoint( {
                iNode : i,
                field : this.field,
                value : {
                    //x:
                    y : item
                }
            } );
            _bottomPointList.push( [ point.pos.x, point.pos.y ] );
        });

        return _bottomPointList;
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
        let _fillStyle
        if( !this._opt.area || !this._opt.area.fillStyle ){
            //如果用户没有配置area.strokeStyle，那么就用默认的
            _fillStyle = this.color;
        } else {
            _fillStyle = this._getColor( this._opt.area.fillStyle );
        }

        let alpha = me.area.alpha;

        if( colorIsHex( _fillStyle ) && !_.isArray(alpha) ){
            alpha = [1,0]
        }

        if ( _.isArray(alpha) ) {
            
            //alpha如果是数组，那么就是渐变背景，那么就至少要有两个值
            //如果拿回来的style已经是个gradient了，那么就不管了
            alpha.length = 2;
            if (alpha[0] == undefined) {
                alpha[0] = 0;
            };
            if (alpha[1] == undefined) {
                alpha[1] = 0;
            };

            let fill_gradient = {
                lineargradient: [
                ]
            }; 

            if( colorIsHex( _fillStyle ) ){
                //创建一个线性渐变
                fill_gradient.lineargradient = [
                    {position: 0, color: colorRgba( _fillStyle, alpha[0])},
                    {position: 1, color: colorRgba( _fillStyle, alpha[1])}
                ]
                _fillStyle = fill_gradient;
            }
        };

        //也可以传入一个线性渐变
        if( _fillStyle && _fillStyle.lineargradient ){

            let lineargradient = _fillStyle.lineargradient;
            //如果是右轴的话，渐变色要对应的反转
            if( this.yAxisAlign == 'right' ){
                lineargradient = lineargradient.reverse();
            };
            //如果用户配置 填充是一个线性渐变
            let lps = this._getLinearGradientPoints( 'area' );
            if( lps && lps.length ) {
                _fillStyle.points = lps;
            };

        }

        //最后，如果是一个十六进制的颜色的话，就变成一个抄底的渐变
    
        return _fillStyle;
    }

    _getLineStrokeStyle( pointList, graphType )
    {
  
        let _style
        if( !this._opt.line || !this._opt.line.strokeStyle ){
            //如果用户没有配置line.strokeStyle，那么就用默认的
            _style = this.color;
        } else {
            _style = this._getColor( this._opt.line.strokeStyle );
        }

        if(colorIsHex(_style)){
            let _lineargradient = {
                lineargradient: [
                    {
                        position: 0,
                        color: colorRgba( _style, 0.2 ) //'rgba(56, 90, 204, 0.2)'
                    },
                    {
                        position: 0.05,
                        color: colorRgba( _style, 1 ) //'rgba(56, 90, 204,  1)'
                    },
                    {
                        position: 0.95,
                        color: colorRgba( _style, 1 ) //'rgba(56, 90, 204, 1)'
                    },
                    {
                        position: 1,
                        color: colorRgba( _style, 0.2 ) //'rgba(56, 90, 204, 0.2)'
                    }
                ]
            } 
            _style = _lineargradient;
        }

            
        let lineargradient = _style.lineargradient;
        if( lineargradient ){

            //如果是右轴的话，渐变色要对应的反转
            if( this.yAxisAlign == 'right' ){
                lineargradient = lineargradient.reverse();
            };

            //如果用户配置 填充是一个线性渐变
            let lps = this._getLinearGradientPoints( 'line', pointList );
            if( !lps ) return;

            _style.points = lps;

            return _style;

        }

        return _style;
        
    }

    _getLinearGradientPoints( graphType='line', pointList ){

        //如果graphType 传入的是area，并且，用户并没有配area.lineargradientDriction,那么就会默认和line.lineargradientDriction对齐
        let driction = this[ graphType ].lineargradientDriction;
        
        !pointList && ( pointList = this._line.context.pointList );

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

            let node = me.data[a];

            let _nodeColor = me._getColor( (me.node.strokeStyle || me.color), a );
            node.color = _nodeColor; //回写回data里，tips的是用的到

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
            let globalAlpha = 0;
            if( this.clipRect && me._growed ){
                let clipRectCtx = this.clipRect.context;
                if( x >= clipRectCtx.x && x<= clipRectCtx.x+clipRectCtx.width ){
                    globalAlpha = 1;
                }
            };

            let lineWidth = me.node.lineWidth || me.line.lineWidth;
            let context = {
                x,y,
                r: me._getProp(me.node.radius, a),
                lineWidth: me._getProp( lineWidth, a) || 2,
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

            let nodeElement = me._nodes.children[ iNode ];

            //同一个元素，才能直接extend context
            if( nodeElement ){
                if( nodeElement.type == _shapeType ){
                    _.extend( nodeElement.context , context );
                } else {
                    nodeElement.destroy();

                    //重新创建一个新的元素放到相同位置
                    nodeElement = new nodeConstructor({
                        context: context
                    });
                    nodeElement.on( event.types.get() , function (e) {
                        
                        e.eventInfo = {
                            trigger : 'this.node', //me.node,
                            nodes   : [ node ]
                        };
                        me._graphs.app.fire( e.type, e );
                    });

                    me._nodes.addChildAt(nodeElement, iNode);
                };
            } else {
                nodeElement = new nodeConstructor({
                    context: context
                });
                nodeElement.on( event.types.get() , function (e) {
                    e.eventInfo = {
                        trigger : 'this.node',//me.node,
                        nodes   : [node]
                    };
                    me._graphs.app.fire( e.type, e );
                });
                me._nodes.addChild(nodeElement);
            };
                
            if ( me.node.corner ) { //拐角才有节点
                let y = me._pointList[a][1];
                let pre = me._pointList[a - 1];
                let next = me._pointList[a + 1];
                if (pre && next) {
                    if (y == pre[1] && y == next[1]) {
                        nodeElement.context.visible = false;
                    }
                }
            };

            node.nodeElement = nodeElement;

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
                let globalAlpha = 0;
                if( this.clipRect && opt._growed ){
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

                let nodeData = me.data[ a ];
                let value = nodeData.value;
                if ( me.label.format ) {
                    //如果有单独给label配置format，就用label上面的配置
                    if( _.isFunction(me.label.format) ){
                        value = me.label.format.apply( me, [value, nodeData] );
                    }
                    if( typeof me.label.format == 'string' ){
                        value = numeral( value ).format( me.label.format )
                    }
                } else {
                    //否则用fieldConfig上面的
                    let fieldConfig = _coord.getFieldConfig( this.field );
                    if(fieldConfig){
                        value = fieldConfig.getFormatValue( value );
                    };
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
                    me._labels.addChild( _label );
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

    _getFillPath(line,bottomLine)
    { 
        let path = '';
        var M = 'M', L = 'L', Z = 'z';
        let originPos = -this._yAxis.originPos;
        let bottomGraphicsData = bottomLine ? bottomLine.graphics.graphicsData : [];
        line.graphics.graphicsData.forEach( (graphicsData, gInd) => {

            let points = [].concat(graphicsData.shape.points);

            if( points.length > 1 ){

                if( bottomGraphicsData.length ){
                    let bottomGraphicsDataGroup = bottomGraphicsData[ gInd ] || bottomGraphicsData.slice(-1)[0];
                    let bpoints = bottomGraphicsDataGroup.shape.points;
                    for( let i=0,l=bpoints.length/2; i<l ; i++){
                        points.push( bpoints[ (l-i-1)*2 ] );
                        points.push( bpoints[ (l-i-1)*2 +1 ] );
                    }
                    points = points.concat([
                        points[0],
                        points[1]
                    ])
                } else {
                    points = points.concat([
                        points[ points.length - 2 ],
                        originPos,
                        points[0],
                        originPos,
                        points[0],
                        points[1]
                    ])
                };

                let pointLen = points.length/2;

                for( var i=0;i<pointLen; i++ ){
                    let x = points[i*2];
                    let y = points[i*2 +1];
                    if( !i ){
                        path += M + x + ' '+ y;
                    } else {
                        path += L + x + ' '+ y;
                        if( i== pointLen-1){
                            path += Z;
                        }
                    }
                }

            }
        });
        return path;
    }

    //根据x方向的 val来 获取对应的node， 这个node可能刚好是一个node， 也可能两个node中间的某个位置
    getNodeInfoOfX( x ){
      
        //现在从data中查找0.5px间距内的值，有的话返回
        for( let i = 0,l = this.data.length; i<l; i++ ){
            if( this.data[i].value !== null && Math.abs( this.data[i].x - x) <= 0.5 ){
                //左右相差不到0.5px的，都算
                return this.data[i];
            }
        };

        let getPointFromXInLine = function( x , line ){
            let p = {x : x, y: 0};
            p.y = line[0][1] + ((line[1][1]-line[0][1])/(line[1][0]-line[0][0])) * (x - line[0][0]);
            return p;
        };

        let point;
        let search = function( points ){ 

            //points 是一维的数据,至少一个点有两个数据
            if( points.length < 2 ) return;

            let pointLen = points.length/2;

            if( x < points[0] || x > points[ (pointLen-1)*2 ] ){ //x<points[0][0] || x>points.slice(-1)[0][0]
                //x不在该points区间，忽略
                return;
            };

            let midInd = parseInt(pointLen / 2);
            let midNextInd = midInd+1;
            let midPreInd = midInd-1;

            let midX = points[ midInd*2 ];
            let midY = points[ midInd*2+1 ];
            if( Math.abs(midX - x ) <= 0.5 ){ //假如中间点的x和查找的x相差0.5以内，就已该midX为准
                point = {
                    x: midX,
                    y: midY
                };
                return;
            };

            let _pl = [];
            if( x > midX ){
                if( x < points[ midNextInd * 2 ]){ //大于midX但是小于下一个点
                    point = getPointFromXInLine( x , [ [ midX,midY ] , [ points[ midNextInd * 2 ], points[ midNextInd * 2 +1 ] ] ] );
                    return;
                } else {
                    _pl = points.slice( midNextInd * 2 );
                }
            } else {
                if( x > points[ midPreInd * 2 ]  ){
                    point = getPointFromXInLine( x , [ [ points[ midPreInd*2 ], points[ midPreInd*2+1 ] ] , [ midX,midY ] ] );
                    return;
                } else {
                    _pl = points.slice( 0 , midInd*2 );
                }
            };

            search(_pl);

        };
        
        
        if( this._line ){
            let lineGraphsData = this._line.graphics.graphicsData;
            lineGraphsData.forEach( graphsData => {
                if( !point ){
                    search( graphsData.shape.points );
                }
            });
        };
        
        if( !point || point.y == undefined ){
            return null;
        };

        //和data 中数据的格式保持一致

        let node = {
            type    : "line",
            iGroup  : this.iGroup,
            iNode   : -1, //并非data中的数据，而是计算出来的数据
            field   : this.field,
            value   : this._yAxis.getValOfPos( -point.y ),
            x       : point.x,
            y       : point.y,
            rowData : null, //非data中的数据，没有rowData
            color   : null
        };

        node.color = this._getProp( this.node.strokeStyle , node );

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
            let _node = node.nodeElement;
      
            if( _node && !node.focused && this.__currFocusInd != iNode ){
    
                //console.log( 'focusOf' )
    
                _node._fillStyle = _node.context.fillStyle;
                _node.context.fillStyle = 'white';
            
                _node.context.r += _node.context.lineWidth/2;
                _node._visible = _node.context.visible;
                _node.context.visible = true;
    
    
    
                let _focusNode = _node.clone();
                this._focusNodes.addChild( _focusNode );
    
                //_focusNode.context.r += 6;
                _focusNode.context.visible = true;
                _focusNode.context.lineWidth = 0; //不需要描边
                _focusNode.context.fillStyle = _node.context.strokeStyle;
                _focusNode.context.globalAlpha = this.node.focus.alpha;
    
                _focusNode.animate({
                    r : _focusNode.context.r + this.node.focus.radiusDiff
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

            let _node = node.nodeElement;
    
            if( _node && node.focused ){
                //console.log('unfocus')
                _node.context.fillStyle = _node._fillStyle;
                _node.context.r  -= _node.context.lineWidth/2;
                _node.context.visible = _node._visible;
                node.focused = false;
                this.__currFocusInd = -1;
            };
        }

    }
}