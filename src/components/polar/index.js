//极坐标 坐标轴
//极坐标系目前对外抛出三个方法
//获取极坐标系内任意半径上的弧度集合
    //[ [{point , radian} , {point , radian}] ... ]
    //getRadiansAtR

    //获取某个点相对圆心的弧度值
    //getRadianInPoint

    //获取某个弧度方向，半径为r的时候的point坐标点位置
    //getPointInRadian

//应用场景中一般需要用到的属性有
//width, height, origin(默认为width/2,height/2)

import Component from "../component"
import Canvax from "canvax2d"

const _ = Canvax._;

export default class polar extends Component
{
    constructor( opts , root )
    {
        super( opts );

        this.type = "polar";
        
        this._opts = opts;
        this.root = root;

        //这个width为坐标系的width，height， 不是 图表的width和height（图表的widht，height有padding等）
        this.width = 0;
        this.height = 0;
        this.origin = {
            x: 0,
            y: 0
        };
        
        this.maxR = null;

        this.grid = {
            enabled : false, // 蜘蛛网，比如pie饼图中不需要
            type : "poly",  // 可选 "circle"
            lineWidth : 1,
            strokeStyle : "#ccc",
            fillStyle : null
        };

        this.scale = {
            enabled : false //刻度尺
        };

        this.sprite = null;

        this.init(opts);
    }

    init(opts)
    {
        this.sprite = new Canvax.Display.Sprite({
            id : "coordinate_polar"
        });

        _.extend(true, this, opts);
    }

    draw()
    {
        this._computeAttr();

        if( this.grid.enabled ){
            //绘制蜘蛛网格

        }
        if( this.scale.enabled ){
            //绘制刻度尺
        }
    }

    _computeAttr()
    {
        var _padding = this.root.padding;
        var rootWidth = this.root.width;
        var rootHeight = this.root.height;

        if( !("width" in this._opts) ){
            this.width = rootWidth-_padding.left-_padding.right;
        };
        if( !("height" in this._opts) ){
            this.height = rootHeight-_padding.top-_padding.bottom;
        };
        if( !("origin" in this._opts) ){
            //如果没有传入任何origin数据，则默认为中心点
            //origin是相对画布左上角的
            this.origin = {
                x : this.width/2 + _padding.left,
                y : this.height/2 + _padding.top
            };
        };

        this._computeMaxR();
    }

    //重新计算 maxR
    _computeMaxR()
    {
        //如果外面要求过 maxR，
        var origin = this.origin;
        var _maxR;
        if( origin.x != this.width/2 || origin.y != this.height/2 ){
            var _distances = [ origin.x , this.width-origin.x , origin.y , this.height - origin.y ];
            _maxR = _.max( _distances );
        } else {
            _maxR = Math.max( this.width / 2 , this.height / 2 );
        };

        if( this.maxR != null && this.maxR <= _maxR ){
            return
        } else {
            this.maxR = _maxR
        };
    }

    //获取极坐标系内任意半径上的弧度集合
    //[ [{point , radian} , {point , radian}] ... ]
    getRadiansAtR( r )
    {
        var me = this;
        var _rs = [];
        if( r > this.maxR ){
            return [];
        } else {
            //下面的坐标点都是已经origin为原点的坐标系统里

            //矩形的4边框线段
            var origin = this.origin;
            var x,y;

            //于上边界的相交点
            //最多有两个交点
            var distanceT = origin.y;
            if( distanceT < r ){
                x = Math.sqrt( Math.pow(r,2)-Math.pow(distanceT , 2) );
                _rs = _rs.concat( this._filterPointsInRect([
                    { x : -x ,y : -distanceT},
                    { x : x  ,y : -distanceT}
                ]) );
            };

            //于右边界的相交点
            //最多有两个交点
            var distanceR = this.width - origin.x;
            if( distanceR < r ){
                y = Math.sqrt( Math.pow(r,2)-Math.pow(distanceR , 2) );
                _rs = _rs.concat( this._filterPointsInRect([
                    { x : distanceR  ,y : -y},
                    { x : distanceR  ,y : y}
                ]) );
            };
            //于下边界的相交点
            //最多有两个交点
            var distanceB = this.height - origin.y;
            if( distanceB < r ){
                x = Math.sqrt( Math.pow(r,2)-Math.pow(distanceB , 2) );
                _rs = _rs.concat( this._filterPointsInRect([
                    { x : x   ,y : distanceB},
                    { x : -x  ,y : distanceB}
                ]) );
            };
            //于左边界的相交点
            //最多有两个交点
            var distanceL = origin.x;
            if( distanceL < r ){
                y = Math.sqrt( Math.pow(r,2)-Math.pow(distanceL , 2) );
                _rs = _rs.concat( this._filterPointsInRect([
                    { x : -distanceL  ,y : y},
                    { x : -distanceL  ,y : -y}
                ]) );
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
                if( !this._checkArcInRect( arcs[i] , r ) ){
                    arcs.splice(i , 1);
                    i--,l--;
                }
            };
            return arcs;
        }
    }

    _filterPointsInRect( points )
    {
        for( var i=0,l=points.length; i<l ; i++ ){
            if( !this._checkPointInRect(points[i]) ){
                //该点不在root rect范围内，去掉
                points.splice( i , 1 );
                i--,l--;
            }
        };
        return points;
    }

    _checkPointInRect(p)
    {
        var origin = this.origin;
        var _tansRoot = { x : p.x + origin.x , y: p.y + origin.y };
        return !( _tansRoot.x < 0 || _tansRoot.x > this.width || _tansRoot.y < 0 || _tansRoot.y > this.height );
    }

    //检查由n个相交点分割出来的圆弧是否在rect内
    _checkArcInRect( arc , r)
    {
        var start = arc[0];
        var to = arc[1];
        var differenceR = to.radian - start.radian;
        if( to.radian < start.radian ){
            differenceR = (Math.PI*2 + to.radian) - start.radian;
        };
        var middleR = (start.radian+differenceR/2)%(Math.PI*2);
        return this._checkPointInRect( this.getPointInRadian( middleR , r ) );
    }

    //获取某个点相对圆心的弧度值
    getRadianInPoint( point )
    {
        var pi2 = Math.PI*2;
        return (Math.atan2(point.y , point.x)+pi2)%pi2;
    }

    //获取某个弧度方向，半径为r的时候的point坐标点位置
    getPointInRadian(radian , r)
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
}