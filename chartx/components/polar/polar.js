define(
    "chartx/components/polar/polar",
    [
         "canvax/index",
         "canvax/shape/Path",
         "chartx/utils/tools"
    ],
    function( Canvax , Path, Tools ){
        var Polar = function( opt , data ){
            this.w = opt.w || 0;
            this.h = opt.h || 0;
            this.origin = {
                x: this.w/2,
                y: this.h/2
            };
            this.maxR = null;

            //极坐标的r轴 半径
            this.rAxis = {
                field : null
            };

            //极坐标的t轴，角度
            this.tAxis = {
                field : null
            };

            this.init(opt, data);
        };
        Polar.prototype = {
            init : function(opt , data){
                _.deepExtend(this, opt);
                this._computeMaxR();
            },
            //重新计算maxR
            _computeMaxR : function(){
                //如果外面要求过maxR，
                var origin = this.origin;
                var _maxR;
                if( origin.x != this.w/2 || origin.y != this.h/2 ){
                    var _distances = [ origin.x , this.w-origin.x , origin.y , this.h - origin.y ];
                    _maxR = _.max( _distances );
                } else {
                    _maxR = Math.max( this.w / 2 , this.h / 2 );
                };

                if( this.maxR != null && this.maxR <= _maxR ){
                    return
                } else {
                    this.maxR = _maxR
                };
            },
            //获取极坐标系内任意半径上的弧度集合
            //[ [{point , radian} , {point , radian}] ... ]
            getRadiansAtR: function( r ){
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
                    var distanceR = this.w - origin.x;
                    if( distanceR < r ){
                        y = Math.sqrt( Math.pow(r,2)-Math.pow(distanceR , 2) );
                        _rs = _rs.concat( this._filterPointsInRect([
                            { x : distanceR  ,y : -y},
                            { x : distanceR  ,y : y}
                        ]) );
                    };
                    //于下边界的相交点
                    //最多有两个交点
                    var distanceB = this.h - origin.y;
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
            },
            _filterPointsInRect: function( points ){
                for( var i=0,l=points.length; i<l ; i++ ){
                    if( !this._checkPointInRect(points[i]) ){
                        //该点不在root rect范围内，去掉
                        points.splice( i , 1 );
                        i--,l--;
                    }
                };
                return points;
            },
            _checkPointInRect: function(p){
                var origin = this.origin;
                var _tansRoot = { x : p.x + origin.x , y: p.y + origin.y };
                return !( _tansRoot.x < 0 || _tansRoot.x > this.w || _tansRoot.y < 0 || _tansRoot.y > this.h );
            },
            //检查由n个相交点分割出来的圆弧是否在rect内
            _checkArcInRect: function( arc , r){
                var start = arc[0];
                var to = arc[1];
                var differenceR = to.radian - start.radian;
                if( to.radian < start.radian ){
                    differenceR = (Math.PI*2 + to.radian) - start.radian;
                };
                var middleR = (start.radian+differenceR/2)%(Math.PI*2);
                return this._checkPointInRect( this.getPointInRadian( middleR , r ) );
            },
            getRadianInPoint: function( point ){
                var pi2 = Math.PI*2;
                return (Math.atan2(point.y , point.x)+pi2)%pi2;
            },
            getPointInRadian: function(radian , r){
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
        };
        return Polar;
    } 
);
