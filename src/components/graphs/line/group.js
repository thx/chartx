import Canvax from "canvax"
import {getPath} from "../../../utils/tools"
import { _ , color, event } from "mmvis"

const AnimationFrame = Canvax.AnimationFrame;
const BrokenLine = Canvax.Shapes.BrokenLine;
const Rect = Canvax.Shapes.Rect;
const Circle = Canvax.Shapes.Circle;
const Path = Canvax.Shapes.Path;
 

export default class LineGraphsGroup extends event.Dispatcher
{
    constructor( fieldMap, iGroup, opt, ctx, h, w )
    {
        super();

        this._opt = opt;
        this.fieldMap = fieldMap;
        this.field = null; //在extend之后要重新设置
        this.iGroup = iGroup;
        
        this._yAxis = fieldMap.yAxis;
        
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.y = 0;

        this.line = { //线
            enabled: 1,
            shapeType : "brokenLine",//折线
            strokeStyle: fieldMap.color,
            lineWidth: 2,
            lineType: "solid",
            smooth: true
        };

        this.node = { //节点 
            enabled     : 1, //是否有
            shapeType   : "circle",
            corner      : false, //模式[false || 0 = 都有节点 | true || 1 = 拐角才有节点]
            radius      : 3, //半径 node 圆点的半径
            fillStyle   : '#ffffff',
            strokeStyle : null,
            lineWidth   : 2
        };

        this.label = {
            enabled     : 0,
            fontColor   : null,
            strokeStyle : null,
            fontSize    : 12,
            format      : null
        };

        this.area = { //填充
            shapeType : "path",
            enabled   :1,
            fillStyle : null,
            alpha     : 0.2
        };

        this.data = []; 
        this.sprite = null;

        this._pointList = []; //brokenline最终的状态
        this._currPointList = []; //brokenline 动画中的当前状态
        this._bline = null;

        _.extend(true, this, opt );

        //TODO group中得field不能直接用opt中得field， 必须重新设置， 
        //group中得field只有一个值，代表一条折线, 后面要扩展extend方法，可以控制过滤哪些key值不做extend
        this.field = fieldMap.field; //iGroup 在yAxis.field中对应的值

        this.init(opt)
    }

    init(opt)
    {
        this.sprite = new Canvax.Display.Sprite();
        var me = this;
        this.sprite.on("destroy" , function(){
            if(me._growTween){
                AnimationFrame.destroyTween( me._growTween );
            }
        });
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
        var me = this;
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
        var color = this._getProp(s, iNode);
        if ( color === undefined || color === null ) {
            //这个时候可以先取线的style，和线保持一致
            color = this._getLineStrokeStyle();

            //因为_getLineStrokeStyle返回的可能是个渐变对象，所以要用isString过滤掉
            if( !color || !_.isString( color ) ){
                //那么最后，取this.fieldMap.color
                color = this.fieldMap.color;
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
            var _nodesInfo = [];
            if( iNode != undefined ){
                _nodesInfo.push( this.getNodeInfoAt( iNode ) );
            };
            return s.apply( this , _nodesInfo );
        };
        return s
    }


    //这个是tips需要用到的 
    getNodeInfoAt( $index )
    {
        var o = this.data[ $index ];
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
        var me = this;

        if( data ){
            this.data = data;
        };

        me._pointList = this._getPointList( this.data );
        var plen = me._pointList.length;
        var cplen = me._currPointList.length;

        var params = {
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
        me._grow();
    }

    _grow(callback , opt)
    {
        var me = this;

        if( !me.data.length ){
            //因为在index中有调用
            callback && callback( me );
            return;
        };

        function _update( list ){
            me._bline.context.pointList = _.clone( list );
            me._bline.context.strokeStyle = me._getLineStrokeStyle( list );

            me._area.context.path = me._fillLine(me._bline);
            me._area.context.fillStyle = me._getFillStyle();

            var iNode=0;
            _.each( list, function( point, i ){
                if( _.isNumber( point[1] ) ){
                    if( me._circles ){
                        var _circle = me._circles.getChildAt(iNode);
                        if( _circle ){
                            _circle.context.x = point[0];
                            _circle.context.y = point[1];
                        }
                    }
                    if( me._labels ){
                        var _text = me._labels.getChildAt(iNode);
                        if( _text ){
                            _text.context.x = point[0];
                            _text.context.y = point[1] - 3;
                            me._checkTextPos( _text , i );
                        }
                    }
                    iNode++;
                }
            } );
        };


        this._growTween = AnimationFrame.registTween({
            from: me._getPointPosStr(me._currPointList),
            to: me._getPointPosStr(me._pointList),
            desc: me.field,
            onUpdate: function( arg ) {
                for (var p in arg) {
                    var ind = parseInt(p.split("_")[2]);
                    var xory = parseInt(p.split("_")[1]);
                    me._currPointList[ind] && (me._currPointList[ind][xory] = arg[p]); //p_1_n中间的1代表x or y
                };
                _update( me._currPointList );
            },
            onComplete: function() {
                me._growTween = null;
                //在动画结束后强制把目标状态绘制一次。
                //解决在onUpdate中可能出现的异常会导致绘制有问题。
                //这样的话，至少最后的结果会是对的。
                _update( me._pointList );
                callback && callback( me );
            }
        });
    }

    _getPointPosStr(list)
    {
        var obj = {};
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
        var list = [];
        for (var a = 0, al = data.length; a < al; a++) {
            var o = data[a];
            list.push([
                o.x,
                o.y
            ]);
        };
        return list;
    }

    _widget( opt )
    {
        var me = this;
        !opt && (opt ={});
        
        me._pointList = this._getPointList(me.data);

        if (me._pointList.length == 0) {
            //filter后，data可能length==0
            return;
        };
        var list = [];
        if (opt.animation) {
            var firstNode = this._getFirstNode();
            var firstY = firstNode ? firstNode.y : undefined;
            for (var a = 0, al = me.data.length; a < al; a++) {
                var o = me.data[a];
                list.push([
                    o.x,
                    _.isNumber( o.y ) ? firstY : o.y
                ]);
            };
        } else {
            list = me._pointList;
        };
        
        me._currPointList = list;

        var bline = new BrokenLine({ //线条
            context: {
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
            }
        });

        if (!this.line.enabled) {
            bline.context.visible = false
        };
        me.sprite.addChild(bline);
        me._bline = bline;

        var area = new Path({ //填充
            context: {
                path: me._fillLine(bline),
                fillStyle: me._getFillStyle(), 
                globalAlpha: _.isArray(me.area.alpha) ? 1 : me.area.alpha
            }
        });

        if( !this.area.enabled ){
            area.context.visible = false
        }
        me.sprite.addChild(area);
        me._area = area;

        me._createNodes();
        me._createTexts();
    }

    _getFirstNode()
    {
        var _firstNode = null;
        for( var i=0,l=this.data.length; i<l; i++ ){
            var nodeData = this.data[i];
            if( _.isNumber( nodeData.y ) ){
                if( _firstNode === null || ( this._yAxis.align == "right" ) ){
                    //_yAxis为右轴的话，
                    _firstNode = nodeData;
                }
                if( this._yAxis.align !== "right" && _firstNode !== null ){
                    break;
                }
            };
        } 
        
        return _firstNode;    
    }

    _getFillStyle()
    {
        var me = this;
    
        var fill_gradient = null;

        // _fillStyle 可以 接受渐变色，可以不用_getColor， _getColor会过滤掉渐变色
        var _fillStyle = me._getProp(me.area.fillStyle) || me._getLineStrokeStyle( null, "fillStyle" );

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

            //从bline中找到最高的点
            var topP = _.min(me._bline.context.pointList, function(p) {
                return p[1]
            });

            if( topP[0] === undefined || topP[1] === undefined ){
                return null
            };

            //创建一个线性渐变
            fill_gradient = me.ctx.createLinearGradient(topP[0], topP[1], topP[0], 0);

            var rgb = color.colorRgb( _fillStyle );
            var rgba0 = rgb.replace(')', ', ' + me._getProp(me.area.alpha[0]) + ')').replace('RGB', 'RGBA');
            fill_gradient.addColorStop(0, rgba0);

            var rgba1 = rgb.replace(')', ', ' + me.area.alpha[1] + ')').replace('RGB', 'RGBA');
            fill_gradient.addColorStop(1, rgba1);

            _fillStyle = fill_gradient;
        };
    
        return _fillStyle;
    }

    _getLineStrokeStyle( pointList, from )
    {
        var me = this;
        var _style
        if( !this._opt.line || !this._opt.line.strokeStyle ){
            //如果用户没有配置line.strokeStyle，那么就用默认的
            return this.line.strokeStyle;
        };

        if( this._opt.line.strokeStyle.lineargradient ){
            //如果用户配置 填充是一个线性渐变
            //从bline中找到最高的点
            !pointList && ( pointList = this._bline.context.pointList );
            
            var topP = _.min(pointList, function(p) {
                return p[1];
            });
            var bottomP = _.max(pointList, function(p) {
                return p[1];
            });
            if( from == "fillStyle" ){
                bottomP = [ 0 , 0 ];
            };

            if( topP[0] === undefined || topP[1] === undefined || bottomP[1] === undefined ){
                return null;
            };
       
            //var bottomP = [ 0 , 0 ];
            //创建一个线性渐变
            //console.log( topP[0] + "|"+ topP[1]+ "|"+  topP[0]+ "|"+ bottomP[1] )
            _style = me.ctx.createLinearGradient(topP[0], topP[1], topP[0], bottomP[1]);
            _.each( this._opt.line.strokeStyle.lineargradient , function( item , i ){
                _style.addColorStop( item.position , item.color);
            });

            return _style;

        } else {
            //构造函数中执行的这个方法，还没有line属性
            //if( this.line && this.line.strokeStyle ){
            //    _style = this.line.strokeStyle
            //} else {
                _style = this._getColor( this._opt.line.strokeStyle );
            //}
            return _style;
        }
        
    }


    _createNodes()
    {
        var me = this;
        var list = me._currPointList;

        if ((me.node.enabled || list.length == 1) && !!me.line.lineWidth) { //拐角的圆点
            if( !this._circles ){
                this._circles = new Canvax.Display.Sprite({});
                this.sprite.addChild(this._circles);
            };
            
            var iNode = 0; //这里不能和下面的a对等，以为list中有很多无效的节点
            for (var a = 0, al = list.length; a < al; a++) {
                var _point = me._currPointList[a];
                if( !_point || !_.isNumber( _point[1] ) ){
                    //折线图中有可能这个point为undefined
                    continue;
                };

                var context = {
                    x: _point[0],
                    y: _point[1],
                    r: me._getProp(me.node.radius, a),
                    lineWidth: me._getProp(me.node.lineWidth, a) || 2,
                    strokeStyle: me._getColor( me.node.strokeStyle, a ),
                    fillStyle: me.node.fillStyle
                };

                var circle = me._circles.children[ iNode ];
                if( circle ){
                    _.extend( circle.context , context );
                } else {
                    circle = new Circle({
                        context: context
                    });
                    me._circles.addChild(circle);
                };
                 
                if (me.node.corner) { //拐角才有节点
                    var y = me._pointList[a][1];
                    var pre = me._pointList[a - 1];
                    var next = me._pointList[a + 1];
                    if (pre && next) {
                        if (y == pre[1] && y == next[1]) {
                            circle.context.visible = false;
                        }
                    }
                };

                iNode++;
            };

            //把过多的circle节点删除了
            if( me._circles.children.length > iNode ){
                for( var i = iNode,l=me._circles.children.length; i<l; i++ ){
                    me._circles.children[i].destroy();
                    i--;
                    l--;
                }
            };
        };
    }

    _createTexts()
    {
        
        var me = this;
        var list = me._currPointList;

        if ( me.label.enabled ) { //节点上面的文本info
            if(!this._labels){
                this._labels = new Canvax.Display.Sprite({});
                this.sprite.addChild(this._labels);
            }
            
            var iNode = 0; //这里不能和下面的a对等，以为list中有很多无效的节点
            for (var a = 0, al = list.length; a < al; a++) {
                var _point = list[a];
                if( !_point || !_.isNumber( _point[1] ) ){
                    //折线图中有可能这个point为undefined
                    continue;
                };

                var context = {
                    x: _point[0],
                    y: _point[1] - 3,
                    fontSize: this.label.fontSize,
                    textAlign: "center",
                    textBaseline: "bottom",
                    fillStyle: me._getColor( me.label.fontColor, a ),
                    lineWidth:1,
                    strokeStyle:"#ffffff"
                };

                var value = me.data[ a ].value;
                if (_.isFunction(me.label.format)) {
                    value = (me.label.format(value, me.data[ a ]) || value );
                };

                if( value == undefined || value == null ){
                    continue;
                };

                var _label = this._labels.children[ iNode ];
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

            //把过多的circle节点删除了
            if( me._labels.children.length > iNode ){
                for( var i = iNode,l=me._labels.children.length; i<l; i++ ){
                    me._labels.children[i].destroy();
                    i--;
                    l--;
                }
            };            
        };
        
    }

    _checkTextPos( _label , ind )
    {
        var me = this;
        var list = me._currPointList;
        var pre = list[ ind - 1 ];
        var next = list[ ind + 1 ];

        if( 
            pre && next &&
            ( pre[1] < _label.context.y && next[1] < _label.context.y )
         ){
            _label.context.y += 7;
            _label.context.textBaseline = "top"
        }
      
    }

    _fillLine(bline)
    { //填充直线
        var fillPath = _.clone(bline.context.pointList);

        var path = "";
        
        var originPos = -this._yAxis.originPos;

        var _currPath = null;


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
}