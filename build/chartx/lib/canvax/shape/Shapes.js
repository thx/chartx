/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 自定义shape的集合
 *
 * 挂再Canvax下面作为一个静态对象，用户可以直接通过
 * Canvax.Shapes.Circle 这样来引用自定义圓类
 *
 **/

define(
    "canvax/shape/Shapes",
    [
        "canvax/shape/BrokenLine",
        "canvax/shape/Circle",
        "canvax/shape/Droplet",
        "canvax/shape/Ellipse",
        "canvax/shape/Isogon",
        "canvax/shape/Line",
        "canvax/shape/Path",
        "canvax/shape/Polygon",
        "canvax/shape/Sector",
        "canvax/shape/Rect"
    ],
    function(
            BrokenLine,
            Circle,
            Droplet,
            Ellipse,
            Isogon,
            Line,
            Path,
            Polygon,
            Sector,
            Rect
){

    var Shapes = {
        BrokenLine  : BrokenLine,  //折线
        Circle      : Circle,      //圆形
        Droplet     : Droplet,     //水滴型
        Ellipse     : Ellipse,     //椭圆形
        Isogon      : Isogon,      //正多边形
        Line        : Line,        //直线
        Path        : Path,        //路径
        Polygon     : Polygon,     //非规则多边形
        Sector      : Sector,      //扇形
        Rect        : Rect         //矩形
    }

    return Shapes;

}
)
