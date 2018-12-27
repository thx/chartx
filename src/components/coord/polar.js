//极坐标 坐标轴
//极坐标系目前对外抛出三个方法
//获取极坐标系内任意半径上的弧度集合
    //[ [{point , radian} , {point , radian}] ... ]
    //getRadiansAtR

    //获取某个点相对圆心的弧度值
    //getRadianInPoint

    //获取某个弧度方向，半径为r的时候的point坐标点位置
    //getPointInRadianOfR

//应用场景中一般需要用到的属性有
//width, height, origin(默认为width/2,height/2)

import coorBase from "./index"
import Canvax from "canvax"
import Grid from "./polar/grid"
import { dataSection,_,getDefaultProps,event } from "mmvis"

export default class extends coorBase
{
    static defaultProps = {
        allAngle : {
            detail : '坐标系总角度',
            documentation : "",
            default       : 360,
            values        : [0, 360]
        },
        startAngle : {
            detail : '坐标系其实角度',
            documentation : "",
            default       : 0,
            values        : [0, 360]
        },
        squareRange : {
            detail : '是否正方形的坐标区域',
            documentation : "",
            default       : true,
            values        : [true, false]
        },
        
        radius : {
            detail : '坐标系的最大半径',
            documentation : "默认自动计算view的高宽，如果squareRange==true，则会取Math.min(width,height)",
            default       : 'auto',
            values        : null
        },
        aAxis : {
            detail : '角度轴',
            documentation : "类似直角坐标系中的x轴",
            propertys     : {
                
                data : [],
                angleList : [], //对应layoutType下的角度list
                layoutData : [], //aAxis.data的 label.format后版本

                field : {
                    detail : '数据字段',
                    documentation : "",
                    default       : ''
                },
                layoutType : {
                    detail : '布局类型',
                    documentation : "",
                    default       : 'proportion'
                },
                beginAngle : {
                    detail : '起始角度',
                    documentation : "",
                    default       : -90
                },
                enabled : {
                    detail : '是否显示',
                    documentation : "",
                    default       : false
                },
                label : {
                    detail : '文本配置',
                    documentation : '',
                    propertys : {
                        enabled : {
                            detail : '是否显示',
                            documentation : "",
                            default       : true
                        },
                        format  : {
                            detail : 'label的格式化处理函数',
                            documentation : "",
                            default : null
                        },
                        fontColor: {
                            detail : 'label颜色',
                            documentation: '',
                            default : "#666"
                        }
                    }
                }
            }
        },
        rAxis : {
            detail : '半径维度轴',
            documentation: '类似直角坐标系中的y轴维度',
            propertys : {
                field : {
                    detail : '数据字段',
                    documentation : "",
                    default       : ''
                },
                dataSection : {
                    detail : '轴的显示数据',
                    documentation : "默认根据源数据中自动计算，用户也可以手动指定",
                    default       : false
                },
                enabled : {
                    detail : '是否显示',
                    documentation : "",
                    default       : false
                }
            }
        }
    } 

    constructor( opt , app )
    {
        super( opt , app );
        this.type  = "polar";
        
        _.extend( true, this, getDefaultProps( new.target.defaultProps ), this.setDefaultOpt( opt, app ) );

        this.init(opt);
    }

    setDefaultOpt( coordOpt, app )
    {
      
        var coord = {
            rAxis : {
                field : []
            },
            aAxis : {},
            grid  : {}
        };
        _.extend( true, coord, coordOpt );

        //根据graphs.field 来 配置 coord.rAxis.field -------------------
        if( !_.isArray( coord.rAxis.field ) ){
            coord.rAxis.field = [ coord.rAxis.field ];
        };

        //根据opt中得Graphs配置，来设置 coord.yAxis
        var graphsArr = _.flatten( [app._opt.graphs] );
        
        //有graphs的就要用找到这个graphs.field来设置coord.rAxis
        var arrs = [];
        _.each( graphsArr, function( graphs ){
            if( graphs.field ){
                //没有配置field的话就不绘制这个 graphs了
                var _fs = graphs.field;
                if( !_.isArray( _fs ) ){
                    _fs = [ _fs ];
                };
                arrs = arrs.concat( _fs );
            };
        } );
        coord.rAxis.field = coord.rAxis.field.concat( arrs );

        if( coordOpt.aAxis &&coordOpt.aAxis.field ){
            coord.aAxis.enabled = true;
        } else {
            //如果aAxis.field都没有的话，是没法绘制grid的，所以grid的enabled就是false
            coord.grid.enabled = false;
        };

        return coord
    }

    init(opt)
    {

        this._initModules();

        //创建好了坐标系统后，设置 _fieldsDisplayMap 的值，
        // _fieldsDisplayMap 的结构里包含每个字段是否在显示状态的enabled 和 这个字段属于哪个yAxis
        this.fieldsMap = this.setFieldsMap({type : "rAxis"});
        
    }


    _initModules()
    {
        if( this.grid.enabled ){
            this._grid = new Grid( this.grid, this );
            this.sprite.addChild( this._grid.sprite );
        };
        if( this.aAxis.enabled && this.grid.enabled ){
            this._aAxisScaleSp = new Canvax.Display.Sprite({
                id : "aAxisScaleSp"
            });
            this.sprite.addChild( this._aAxisScaleSp );
        };

        this._axiss.push( {
            type : "rAxis",
            field : this.rAxis.field
        } );
    }

    draw( opt )
    {
        !opt && (opt ={});
        
        //先计算好要绘制的width,height, origin
        this._computeAttr();

        this.rAxis.dataSection = this._getRDataSection();
        this.aAxis.data = this.app.dataFrame.getFieldData( this.aAxis.field );

        this._setAAxisAngleList();

        if( this.grid.enabled ){

            this._grid.draw( {
                pos    : this.origin,
                width  : this.width,
                height : this.height,
                dataSection : this.rAxis.dataSection
            } , this);

            if( this.aAxis.enabled ){
                this._drawAAxis();
            };
    
            this._initInduce();
        };
    }


    resetData( dataFrame , dataTrigger )
    {

    }

    changeFieldEnabled( field )
    {
    
        this.setFieldEnabled( field );

        this.rAxis.dataSection = this._getRDataSection();
        this.aAxis.data = this.app.dataFrame.getFieldData( this.aAxis.field );

        if( this.grid.enabled ){

            this._grid.reset( {
                dataSection : this.rAxis.dataSection
            } , this);
    
        };

    }

    _getRDataSection(){
        var me = this;
        //如果用户有主动配置了dataSection,是不需要计算dataSection的
        //目前没有做堆叠的dataSection，后面有需要直接从yAxis的模块中拿
        if( this._opt.rAxis && this._opt.rAxis.dataSection ){
            return this._opt.rAxis.dataSection
        };

        var arr = [];
        _.each( _.flatten( [me.rAxis.field] ), function( field ){
            arr = arr.concat( me.app.dataFrame.getFieldData( field ) );
        } );
        return dataSection.section(arr, 3);
        
    }

    _computeAttr()
    {
        var _r;
        var _squareRangeScaleX = 1;
        var _squareRangeScaleY = 1;

        var _padding = this.app.padding;
        var rootWidth = this.app.width;
        var rootHeight = this.app.height;

        var vw = rootWidth - _padding.left - _padding.right;
        var vh = rootHeight - _padding.top - _padding.bottom;
        

        if( !("width" in this._opt) ){
            this.width = vw;
        };
        if( !("height" in this._opt) ){
            this.height = vh;
        };
        if( this.aAxis.enabled ){
            this.width -= 20*2;
            this.height -= 20*2;
        };

        //重置width和height ， 不能和上面的计算origin调换位置
        if( this.squareRange ){
            var _num = Math.min( this.width, this.height );
            
            if( this.width > this.height ){
                //那么就是缩放了width， 就是x
                _squareRangeScaleX = _num / this.width;
            } 
            if( this.width < this.height ){
                //那么就是缩放了width， 就是x
                _squareRangeScaleY = _num / this.height;
            } 
            
            //_r = _num/2;
            this.width = this.height = _num;
            
        };

        if( !("origin" in this._opt) ){
            //如果没有传入任何origin数据，则默认为中心点
            //origin是相对画布左上角的

            /*
            this.origin = {
                x : _padding.left + vw/2,
                y : _padding.top + vh/2 
            };
            */

            //if( this.allAngle % 360 != 0 ){
                var sinTop=0,sinBottom=0,cosLeft=0,cosRight=0;
                //如果该坐标系并非一个整圆,那么圆心位置 需要对应的调整，才能铺满整个画布
                var angles = [ this.startAngle ]
                for( var i=0,l= parseInt(this.allAngle/90); i<=l;i++ ){
                    var angle = parseInt(this.startAngle/90)*90 + i*90;
                    if( _.indexOf( angles, angle ) == -1 && angle>angles.slice(-1)[0] ){
                        angles.push( angle );
                    };
                };

                var lastAngle = this.startAngle + this.allAngle;
                if( _.indexOf( angles, lastAngle ) == -1 ){
                    angles.push( lastAngle );
                };
                console.log(angles)
                _.each( angles, function( angle ){
                    if( angle != 360 ){
                        angle = angle % 360;
                    };
                    var _sin = Math.sin( angle*Math.PI/180 );
                    if( angle == 180 ){
                        _sin = 0;
                    };

                    var _cos = Math.cos( angle*Math.PI/180 );
                    if( angle == 270 || angle == 90 ){
                        _cos = 0;
                    };

                    sinTop = Math.min( sinTop, _sin );
                    sinBottom = Math.max( sinBottom, _sin );
                    cosLeft = Math.min( cosLeft, _cos );
                    cosRight = Math.max( cosRight, _cos );
                } );
                console.log( [ sinTop,cosRight,sinBottom,cosLeft ] );
                debugger
                var _disv = [
                    Math.abs(parseInt(this.height * (sinTop/(sinTop-sinBottom)))),//上边距
                    //Math.abs(parseInt(this.width * (cosRight/(cosLeft-cosRight)))),//右边距
                    Math.abs(parseInt(this.height * (sinBottom/(sinTop-sinBottom)))),//下边距
                    //Math.abs(parseInt(this.width * (cosLeft/(cosLeft-cosRight))))
                ];
                var _dish = [
                    //Math.abs(parseInt(this.height * (sinTop/(sinTop-sinBottom)))),//上边距
                    Math.abs(parseInt(this.width * (cosRight/(cosLeft-cosRight)))),//右边距
                    //Math.abs(parseInt(this.height * (sinBottom/(sinTop-sinBottom)))),//下边距
                    Math.abs(parseInt(this.width * (cosLeft/(cosLeft-cosRight))))
                ];
            
                _r = _.min( [
                    _.max( _disv ),
                    _.max( _dish )
                ]);

                this.origin = {
                    x : _padding.left  + vw * (cosLeft/(cosLeft-cosRight)) - (vw-this.width)/2, //rootWidth/2,
                    y : _padding.top + vh * (sinTop/(sinTop-sinBottom)) - (vh-this.height)/2
                };
            
            //};
        };

        //计算maxR
        //如果外面要求过 maxR，
        var origin = this.origin;

        if( !this.squareRange ){
            var _distances = [ 
                origin.x-_padding.left , //原点到left的距离
                vw+_padding.left - origin.x , //原点到右边的距离
                origin.y-_padding.top , 
                vh + _padding.top - origin.y
            ];
            _r = _.max( _distances );
        };
        
        /*
        if( origin.x != this.width/2 || origin.y != this.height/2 ){
            var _distances = [ 
                origin.x-_padding.left , //原点到left的距离
                vw+_padding.left - origin.x , //原点到右边的距离
                origin.y-_padding.top , 
                vh + _padding.top - origin.y
            ];
            _r = _.max( _distances );
        } else {
            _r = Math.max( vw / 2 , vh / 2 );
        };
        

        if( !(this.radius != 'auto' && this.radius <= _r) ){
            this.radius = _r
        };
        */

        this.radius = _r

        console.log( this.radius );
        
    }

    //获取极坐标系内任意半径上的弧度集合
    //[ [{point , radian} , {point , radian}] ... ]
    getRadiansAtR( r , width , height)
    {
        
        var me = this;
        if( width == undefined ){
            width = this.width;
        };
        if( height == undefined ){
            height = this.height;
        };

        var _rs = [];
        if( r > this.radius ){
            return [];
        } else {
            //下面的坐标点都是已经origin为原点的坐标系统里

            //矩形的4边框线段
            var _padding = this.app.padding;
            
            //这个origin 是相对在width，height矩形范围内的圆心，
            //而this.origin 是在整个画布的位置
            var origin = {
                x : this.origin.x - _padding.left - (this.width-width)/2,
                y : this.origin.y - _padding.top - (this.height-height)/2
            };
            var x,y;
            

            //于上边界的相交点
            //最多有两个交点
            var distanceT = origin.y;
            if( distanceT < r ){
                x = Math.sqrt( Math.pow(r,2)-Math.pow(distanceT , 2) );
                _rs = _rs.concat( this._filterPointsInRect([
                    { x : -x ,y : -distanceT},
                    { x : x  ,y : -distanceT}
                ], origin,width, height) );
            };

            //于右边界的相交点
            //最多有两个交点
            var distanceR = width - origin.x;
            if( distanceR < r ){
                y = Math.sqrt( Math.pow(r,2)-Math.pow(distanceR , 2) );
                _rs = _rs.concat( this._filterPointsInRect([
                    { x : distanceR  ,y : -y},
                    { x : distanceR  ,y : y}
                ], origin, width, height) );
            };
            //于下边界的相交点
            //最多有两个交点
            var distanceB = height - origin.y;
            if( distanceB < r ){
                x = Math.sqrt( Math.pow(r,2)-Math.pow(distanceB , 2) );
                _rs = _rs.concat( this._filterPointsInRect([
                    { x : x   ,y : distanceB},
                    { x : -x  ,y : distanceB}
                ], origin, width, height) );
            };
            //于左边界的相交点
            //最多有两个交点
            var distanceL = origin.x;
            if( distanceL < r ){
                y = Math.sqrt( Math.pow(r,2)-Math.pow(distanceL , 2) );
                _rs = _rs.concat( this._filterPointsInRect([
                    { x : -distanceL  ,y : y},
                    { x : -distanceL  ,y : -y}
                ], origin, width, height) );
            };


            var arcs = [];//[ [{point , radian} , {point , radian}] ... ]
            //根据相交点的集合，分割弧段
            if( _rs.length == 0 ){
                //说明整圆都在画布内
                //[ [0 , 2*Math.PI] ];
                arcs.push([
                    {point : {x: r , y: 0} , radian: 0},
                    {point : {x: r , y: 0} , radian: Math.PI*2}
                ]);
            } else {
                //分割多段
                _.each( _rs , function( point , i ){
                    var nextInd = ( i==(_rs.length-1) ? 0 : i+1 );
                    var nextPoint = _rs.slice( nextInd , nextInd+1 )[0];
                    arcs.push([
                        {point: point , radian: me.getRadianInPoint( point )},
                        {point: nextPoint , radian: me.getRadianInPoint( nextPoint )}
                    ]);
                } );
            };

            //过滤掉不在rect内的弧线段
            for( var i=0,l=arcs.length ; i<l ; i++ ){
                if( !this._checkArcInRect( arcs[i] , r , origin, width, height) ){
                    arcs.splice(i , 1);
                    i--,l--;
                }
            };
            return arcs;
        }
    }

    _filterPointsInRect( points , origin, width, height)
    {
        for( var i=0,l=points.length; i<l ; i++ ){
            if( !this._checkPointInRect(points[i], origin, width, height) ){
                //该点不在root rect范围内，去掉
                points.splice( i , 1 );
                i--,l--;
            }
        };
        return points;
    }

    _checkPointInRect(p, origin, width, height)
    {
        var _tansRoot = { x : p.x + origin.x , y: p.y + origin.y };
        return !( _tansRoot.x < 0 || _tansRoot.x > width || _tansRoot.y < 0 || _tansRoot.y > height );
    }

    //检查由n个相交点分割出来的圆弧是否在rect内
    _checkArcInRect( arc, r, origin, width, height)
    {
        var start = arc[0];
        var to = arc[1];
        var differenceR = to.radian - start.radian;
        if( to.radian < start.radian ){
            differenceR = (Math.PI*2 + to.radian) - start.radian;
        };
        var middleR = (start.radian+differenceR/2)%(Math.PI*2);
        return this._checkPointInRect( this.getPointInRadianOfR( middleR , r ) , origin, width, height);
    }

    //获取某个点相对圆心的弧度值
    getRadianInPoint( point )
    {
        var pi2 = Math.PI*2;
        return (Math.atan2(point.y , point.x)+pi2)%pi2;
    }

    //获取某个弧度方向，半径为r的时候的point坐标点位置
    getPointInRadianOfR(radian , r)
    {
        var pi = Math.PI;
        var x = Math.cos( radian ) * r;
        if( radian == (pi/2) || radian == pi*3/2 ){
            //90度或者270度的时候
            x = 0;
        };
        var y = Math.sin( radian ) * r;
        if( radian % pi == 0 ){
            y = 0;
        };
        return {
            x : x,
            y : y
        };
    }


    //获取这个num在dataSectio中对应的半径
    getROfNum( num )
    {
        var r = 0;
        var maxNum = _.max( this.rAxis.dataSection );
        var minNum = 0; //Math.min( this.rAxis.dataSection );
        var _r = parseInt( Math.max( this.width, this.height ) / 2 );

        r = _r * ( (num-minNum) / (maxNum-minNum) );
        return r;
    }

    //获取在r的半径上面，沿aAxis的points
    getPointsOfR( r )
    {
        var me = this;
        var points = [];
        _.each( me.aAxis.angleList, function( _a ){
            //弧度
            var _r = Math.PI*_a / 180;
            var point = me.getPointInRadianOfR( _r, r );
            points.push( point )
        } );
        return points;
    }

    _setAAxisAngleList()
    {
        var me = this;

        me.aAxis.angleList = [];

        var aAxisArr = this.aAxis.data;
        if( this.aAxis.layoutType == "proportion" ){
            aAxisArr = [];
            for( var i=0, l=this.aAxis.data.length; i<l; i++ ){
                aAxisArr.push( i );
            }
        };

        var allAngle = this.allAngle;

        var min = 0;
        var max = _.max( aAxisArr );
        if( this.aAxis.layoutType == "proportion" ){
            max ++;
        };

        _.each( aAxisArr, function( p ){
            //角度
            var _a = ((allAngle * ( (p-min)/(max-min) ) + me.aAxis.beginAngle) + allAngle)%allAngle;
            me.aAxis.angleList.push( _a );
        } );
        
    }

    _drawAAxis()
    {
        //绘制aAxis刻度尺
        var me = this;
        var r = me.getROfNum( _.max( this.rAxis.dataSection ) );
        var points = me.getPointsOfR( r + 3 );

        me._aAxisScaleSp.context.x = this.origin.x;
        me._aAxisScaleSp.context.y = this.origin.y;

        _.each( this.aAxis.data , function( value , i ){

            if( !me.aAxis.label.enabled ) return;

            var point = points[i];
            var c = {
                x : point.x,
                y : point.y,
                fillStyle : me.aAxis.label.fontColor
            };

            var text = _.isFunction(me.aAxis.label.format) ? me.aAxis.label.format( value ) : value;
            _.extend( c , me._getTextAlignForPoint(Math.atan2(point.y , point.x)) );
            me._aAxisScaleSp.addChild(new Canvax.Display.Text( text , {
                context : c
            }));

            me.aAxis.layoutData.push( text );
            
        } );
    }

    /**
     *把弧度分为4大块区域-90 --> 0 , 0-->90 , 90-->180, -180-->-90
     **/
    _getTextAlignForPoint(r)
    {
        var textAlign    = "center";
        var textBaseline = "bottom";

        /* 默认的就不用判断了
        if(r==-Math.PI/2){
            return {
                textAlign    : "center",
                textBaseline : "bottom"
            }
        }
        */
        if(r>-Math.PI/2 && r<0){
            textAlign    = "left";
            textBaseline = "bottom";
        }
        if(r==0){
            textAlign    = "left";
            textBaseline = "middle";
        }
        if(r>0 && r<Math.PI/2){
            textAlign    = "left";
            textBaseline = "top";
        }
        if(r==Math.PI/2){
            textAlign    = "center";
            textBaseline = "top";
        }
        if(r>Math.PI/2 && r<Math.PI){
            textAlign    = "right";
            textBaseline = "top";
        }
        if(r==Math.PI || r == -Math.PI){
            textAlign    = "right";
            textBaseline = "middle";
        }
        if(r>-Math.PI && r < -Math.PI/2){
            textAlign    = "right";
            textBaseline = "bottom";
        }
        return {
            textAlign    : textAlign,
            textBaseline : textBaseline
        }
    }

    getAxisNodeOf( e )
    {
        var me = this;
        var aAxisInd = me.getAAxisIndOf( e );

        if( aAxisInd === undefined ){
            return;
        }

        var node = {
            ind   : aAxisInd,
            value : me.aAxis.data[aAxisInd],
            text  : me.aAxis.layoutData[aAxisInd],
            angle : me.aAxis.angleList[aAxisInd]
        };
        return node;
    }

    //从event中计算出来这个e.point对应origin的index分段索引值
    getAAxisIndOf( e )
    {
        var me = this;

        if( e.aAxisInd !== undefined ){
            return e.aAxisInd;
        };

        if( !me.aAxis.angleList.length ){
            return;
        };

        var point = e.point;

        //angle全部都换算到0-360范围内
        var angle = (me.getRadianInPoint( point ) * 180 / Math.PI - me.aAxis.beginAngle) % me.allAngle;
        var r = Math.sqrt( Math.pow( point.x, 2 ) + Math.pow( point.y, 2 ) );

        var aAxisInd = 0;
        var aLen = me.aAxis.angleList.length;
        _.each( me.aAxis.angleList , function( _a, i ){

            _a = (_a - me.aAxis.beginAngle) % me.allAngle;

            var nextInd = i+1;
            var nextAngle = (me.aAxis.angleList[ nextInd ] - me.aAxis.beginAngle) % me.allAngle;
            if( i == aLen - 1 ){
                nextInd = 0;
                nextAngle = me.allAngle;
            };
            
            //把两个极角坐标都缩放到r所在的维度上面
            if( angle >= _a && angle <= nextAngle ){
                //说明就再这个angle区间
                if( angle - _a < nextAngle - angle ){
                    aAxisInd = i;
                } else {
                    aAxisInd = nextInd;
                }
                return false;
            };

        } ); 
        return aAxisInd;
    }

    _initInduce()
    {
        var me = this;
        me.induce = this._grid.induce;
        me.induce && me.induce.on(event.types.get(), function(e) {
            me.fire( e.type, e );
            //图表触发，用来处理Tips
            me.app.fire( e.type, e );
        });
    }

    getTipsInfoHandler( e )
    {
        //这里只获取xAxis的刻度信息;
        var me = this;

        var aNode = me.getAxisNodeOf( e );
        
        var obj = {
            //aAxis : aNode,
            //title : aNode.label,
            //iNode : aNode.ind,
            nodes : [
                //遍历_graphs 去拿东西
            ]
        };
        if( aNode ){
            obj.aAxis = aNode;
            obj.title = aNode.text;
            obj.iNode = aNode.ind;
        };
        
        if( e.eventInfo ){
            obj = _.extend(obj, e.eventInfo);
        };
        return obj;
    }

    //TODO待实现
    getPoint( opt ){

    }
    getSizeAndOrigin(){
        
    }
}