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

import coorBase from "../ui_coord_base"
import Canvax from "canvax"
import Grid from "./grid"
import DataSection from "../../../utils/datasection"

const _ = Canvax._;

export default class polarComponent extends coorBase
{
    constructor( opt , root )
    {
        super( opt , root );

        this.type  = "polar";
        
        this.allAngle = 360; //默认是个周园

        this.aAxis = {
            field : null,
            layoutType : "average", // average 弧度均分， proportion 和直角坐标中的一样
            data : [],
            angleList : [], //对应layoutType下的角度list
            beginAngle : -90,
            
            //刻度尺,在最外沿的蜘蛛网上面
            layoutData : [], //aAxis.data的 label.format后版本
            enabled : opt.aAxis && opt.aAxis.field,
            label : {
                enabled : true,
                format : function( v ){ return v },
                fontColor : "#666"
            }
        };

        this.rAxis = {
            field : [],
            dataSection : null,
            //半径刻度尺,从中心点触发，某个角度达到最外沿的蜘蛛网为止
            enabled : false 
        };

        this.grid = {
            enabled : false
        };

        this.maxR = null;
        this.squareRange = true; //default true, 说明将会绘制一个width===height的矩形范围内，否则就跟着画布走

        _.extend(true, this, opt);

        if( !this.aAxis.field ){
            //如果aAxis.field都没有的话，是没法绘制grid的，所以grid的enabled就是false
            this.grid.enabled = false;
        };

        this.init(opt);
    }

    init(opt)
    {
        this.sprite = new Canvax.Display.Sprite({
            id : "coord_polar"
        });

        this._initModules();

        //创建好了坐标系统后，设置 _fieldsDisplayMap 的值，
        // _fieldsDisplayMap 的结构里包含每个字段是否在显示状态的enabled 和 这个字段属于哪个yAxis
        this.fieldsMap = this._setFieldsMap();
    }

    resetData( dataFrame , dataTrigger )
    {

    }

    draw( opt )
    {
        !opt && (opt ={});
        
        //先计算好要绘制的width,height, origin
        this._computeAttr();

        this.rAxis.dataSection = this._getRDataSection();
        this.aAxis.data = this.root.dataFrame.getFieldData( this.aAxis.field );

        this._setAAxisAngleList();

        if( this.grid.enabled ){

            this._grid.draw( {
                pos    : this.origin,
                width  : this.width,
                height : this.height,
                dataSection : this.rAxis.dataSection
            } , this);

            if( this.aAxis.enabled ){
                this._drawAAxisScale();
            };
    
            this._initInduce();
        };
    }

    changeFieldEnabled( field )
    {
    
        this.setFieldEnabled( field );

        this.rAxis.dataSection = this._getRDataSection();
        this.aAxis.data = this.root.dataFrame.getFieldData( this.aAxis.field );

        if( this.grid.enabled ){

            this._grid.reset( {
                dataSection : this.rAxis.dataSection
            } , this);
    
        };

    }

    //从 fieldsMap 中过滤筛选出来一个一一对应的 enabled为true的对象结构
    //这个方法还必须要返回的数据里描述出来多y轴的结构。否则外面拿到数据后并不好处理那个数据对应哪个轴
    getEnabledFields( fields )
    {
        if( fields ){
            //如果有传参数 fields 进来，那么就把这个指定的 fields 过滤掉 enabled==false的field
            //只留下enabled的field 结构
            return this.filterEnabledFields( fields );
        };

        var fmap = [];

        _.each( this.fieldsMap, function( bamboo, b ){
            if( _.isArray( bamboo ) ){
                //多节竹子
                var fields = [];
                
                //设置完fields后，返回这个group属于left还是right的axis
                _.each( bamboo, function( obj, v ){
                    if( obj.field && obj.enabled ){
                        fields.push( obj.field );
                    }
                } );

                fields.length && fmap.push( fields );

            } else {
                //单节棍
                if( bamboo.field && bamboo.enabled ){
                    fmap.push( bamboo.field );
                }
            };
        } );

        return fmap;
    }

    //和原始field结构保持一致，但是对应的field换成 {field: , enabled:...}结构
    //目前没用到二维堆叠的功能，但是这段代码和直角坐标系中得保持一致，具备这样得能力
    _setFieldsMap()
    {
        var me = this;
        var fieldInd = 0;

        function _set( fields ){
            if(!fields){
                fields = me.rAxis.field;
            };
    
            if( _.isString(fields) ){
                fields = [fields];
            };

            var clone_fields = _.clone( fields );
            for(var i = 0 , l=fields.length ; i<l ; i++) {
                if( _.isString( fields[i] ) ){
                    clone_fields[i] = {
                        field : fields[i],
                        enabled : true,
                        color : me.root._theme[ fieldInd ],
                        ind : fieldInd++,
                        group : null //这个field对应的ui分组
                    }
                }
                if( _.isArray( fields[i] ) ){
                    clone_fields[i] = _set( fields[i], fieldInd );
                }
            };

            return clone_fields;
        };

        return _set();
    }

    _getRDataSection(){
        var me = this;
        //如果用户有主动配置了dataSection,是不需要计算dataSection的
        //目前没有做堆叠的dataSection，后面有需要直接从yAxis的模块中拿
        if( !this._opts.rAxis.dataSection ){
            var arr = [];
            _.each( _.flatten( [me.rAxis.field] ), function( field ){
                arr = arr.concat( me.root.dataFrame.getFieldData( field ) );
            } );
            
            var _dataSection = DataSection.section(arr, 3);

            return _dataSection;
        }
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
    }

    _computeAttr()
    {
        var _padding = this.root.padding;
        var rootWidth = this.root.width;
        var rootHeight = this.root.height;

        if( !("width" in this._opts) ){
            this.width = rootWidth - _padding.left - _padding.right;
        };
        if( !("height" in this._opts) ){
            this.height = rootHeight - _padding.top - _padding.bottom;
        };

        if( this.aAxis.enabled ){
            this.width -= 20*2;
            this.height -= 20*2;
        };

        //重置width和height ， 不能和上面的计算origin调换位置
        if( this.squareRange ){
            var _num = Math.min( this.width, this.height );
            this.width = this.height = _num;
        };


        if( !("origin" in this._opts) ){
            //如果没有传入任何origin数据，则默认为中心点
            //origin是相对画布左上角的
            this.origin = {
                x : _padding.left + ( rootWidth - _padding.left - _padding.right )/2, //rootWidth/2,
                y : _padding.top + ( rootHeight - _padding.top - _padding.bottom )/2  //rootHeight/2
            };
        };

        //计算maxR
        //如果外面要求过 maxR，
        var origin = this.origin;
        var _maxR;
        if( origin.x != this.width/2 || origin.y != this.height/2 ){
            var _distances = [ origin.x , this.width-origin.x , origin.y , this.height - origin.y ];
            _maxR = _.max( _distances );
        } else {
            _maxR = Math.max( this.width / 2 , this.height / 2 );
        };

        if( !(this.maxR != null && this.maxR <= _maxR) ){
            this.maxR = _maxR
        };
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
        if( r > this.maxR ){
            return [];
        } else {
            //下面的坐标点都是已经origin为原点的坐标系统里

            //矩形的4边框线段
            var _padding = this.root.padding;
            
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
        var maxR = parseInt( Math.max( this.width, this.height ) / 2 );

        r = maxR * ( (num-minNum) / (maxNum-minNum) );
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
        if( this.aAxis.layoutType == "average" ){
            aAxisArr = [];
            for( var i=0, l=this.aAxis.data.length; i<l; i++ ){
                aAxisArr.push( i );
            }
        };

        var allAngle = this.allAngle;

        var min = 0;
        var max = _.max( aAxisArr );
        if( this.aAxis.layoutType == "average" ){
            max ++;
        };

        _.each( aAxisArr, function( p ){
            //角度
            var _a = ((allAngle * ( (p-min)/(max-min) ) + me.aAxis.beginAngle) + allAngle)%allAngle;
            me.aAxis.angleList.push( _a );
        } );
        
    }

    _drawAAxisScale()
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

            var text = me.aAxis.label.format( value );
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
        me.induce && me.induce.on("panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {
            me.fire( e.type, e );
            //图表触发，用来处理Tips
            me.root.fire( e.type, e );
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
            nodes : [
                //遍历_graphs 去拿东西
            ]
        };
        if( aNode ){
            obj.aAxis = aNode;
            obj.title = aNode.text;
        };
        
        if( e.eventInfo ){
            obj = _.extend(obj, e.eventInfo);
        };
        return obj;
    }
}