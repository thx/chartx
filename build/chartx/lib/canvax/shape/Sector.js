/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 扇形 类
 *
 * 坐标原点再圆心
 *
 * 对应context的属性有
 * @r0 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
 * @r  必须，外圆半径
 * @startAngle 起始角度(0, 360)
 * @endAngle   结束角度(0, 360)
 **/


define(
    "canvax/shape/Sector",
    [
        "canvax/display/Shape",
        "canvax/geom/Math",
        "canvax/core/Base"
    ],
    function(Shape , myMath , Base){
 
        var Sector = function(opt){
            var self  = this;
            self.type = "sector";
            self.regAngle  = [];
            self.isRing    = false;//是否为一个圆环
     
            opt = Base.checkOpt( opt );
            self._context  = {
                pointList  : [],//边界点的集合,私有，从下面的属性计算的来
                r0         : opt.context.r0         || 0,// 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
                r          : opt.context.r          || 0,//{number},  // 必须，外圆半径
                startAngle : opt.context.startAngle || 0,//{number},  // 必须，起始角度[0, 360)
                endAngle   : opt.context.endAngle   || 0, //{number},  // 必须，结束角度(0, 360]
                clockwise  : opt.context.clockwise  || false //是否顺时针，默认为false(顺时针)
            }
            arguments.callee.superclass.constructor.apply(this , arguments);
        };
     
        Base.creatClass(Sector , Shape , {
            draw : function(ctx, context) {
                // 形内半径[0,r)
                var r0 = typeof context.r0 == 'undefined' ? 0 : context.r0;
                var r  = context.r;                            // 扇形外半径(0,r]
                var startAngle = myMath.degreeTo360(context.startAngle);          // 起始角度[0,360)
                var endAngle   = myMath.degreeTo360(context.endAngle);              // 结束角度(0,360]
     
                //var isRing     = false;                       //是否为圆环

                //if( startAngle != endAngle && Math.abs(startAngle - endAngle) % 360 == 0 ) {
                if( startAngle == endAngle && context.startAngle != context.endAngle ) {
                    //如果两个角度相等，那么就认为是个圆环了
                    this.isRing     = true;
                    startAngle = 0 ;
                    endAngle   = 360;
                }
     
                startAngle = myMath.degreeToRadian(startAngle);
                endAngle   = myMath.degreeToRadian(endAngle);
             
                //处理下极小夹角的情况
                if( endAngle - startAngle < 0.025 ){
                    startAngle -= 0.003
                }

                ctx.arc( 0 , 0 , r, startAngle, endAngle, this.context.clockwise);
                if (r0 !== 0) {
                    if( this.isRing ){
                        //加上这个isRing的逻辑是为了兼容flashcanvas下绘制圆环的的问题
                        //不加这个逻辑flashcanvas会绘制一个大圆 ， 而不是圆环
                        ctx.moveTo( r0 , 0 );
                        ctx.arc( 0 , 0 , r0 , startAngle , endAngle , !this.context.clockwise);
                    } else {
                        ctx.arc( 0 , 0 , r0 , endAngle , startAngle , !this.context.clockwise);
                    }
                } else {
                    //TODO:在r0为0的时候，如果不加lineTo(0,0)来把路径闭合，会出现有搞笑的一个bug
                    //整个圆会出现一个以每个扇形两端为节点的镂空，我可能描述不清楚，反正这个加上就好了
                    ctx.lineTo(0,0);
                }
             },
             getRegAngle : function(){
                 this.regIn      = true;  //如果在start和end的数值中，end大于start而且是顺时针则regIn为true
                 var c           = this.context;
                 var startAngle = myMath.degreeTo360(c.startAngle);          // 起始角度[0,360)
                 var endAngle   = myMath.degreeTo360(c.endAngle);            // 结束角度(0,360]

                 if ( ( startAngle > endAngle && !c.clockwise ) || ( startAngle < endAngle && c.clockwise ) ) {
                     this.regIn  = false; //out
                 };
                 //度的范围，从小到大
                 this.regAngle   = [ 
                     Math.min( startAngle , endAngle ) , 
                     Math.max( startAngle , endAngle ) 
                 ];
             },
             getRect : function(context){
                 var context = context ? context : this.context;
                 var r0 = typeof context.r0 == 'undefined'     // 形内半径[0,r)
                     ? 0 : context.r0;
                 var r = context.r;                            // 扇形外半径(0,r]
                 
                 this.getRegAngle();

                 var startAngle = myMath.degreeTo360(context.startAngle);          // 起始角度[0,360)
                 var endAngle   = myMath.degreeTo360(context.endAngle);            // 结束角度(0,360]

                 /*
                 var isCircle = false;
                 if( Math.abs( startAngle - endAngle ) == 360 
                         || ( startAngle == endAngle && startAngle * endAngle != 0 ) ){
                     isCircle = true;
                 }
                 */
     
                 var pointList  = [];
     
                 var p4Direction= {
                     "90" : [ 0 , r ],
                     "180": [ -r, 0 ],
                     "270": [ 0 , -r],
                     "360": [ r , 0 ] 
                 };
     
                 for ( var d in p4Direction ){
                     var inAngleReg = parseInt(d) > this.regAngle[0] && parseInt(d) < this.regAngle[1];
                     if( this.isRing || (inAngleReg && this.regIn) || (!inAngleReg && !this.regIn) ){
                         pointList.push( p4Direction[ d ] );
                     }
                 }
     
                 if( !this.isRing ) {
                     startAngle = myMath.degreeToRadian( startAngle );
                     endAngle   = myMath.degreeToRadian( endAngle   );
     
                     pointList.push([
                             myMath.cos(startAngle) * r0 , myMath.sin(startAngle) * r0
                             ]);
     
                     pointList.push([
                             myMath.cos(startAngle) * r  , myMath.sin(startAngle) * r
                             ]);
     
                     pointList.push([
                             myMath.cos(endAngle)   * r  ,  myMath.sin(endAngle)  * r
                             ]);
     
                     pointList.push([
                             myMath.cos(endAngle)   * r0 ,  myMath.sin(endAngle)  * r0
                             ]);
                 }
     
                 context.pointList = pointList;
                 return this.getRectFormPointList( context );
             }
     
        });
     
        return Sector;
     
    }
);
