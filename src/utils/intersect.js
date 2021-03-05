import Vec2 from 'vec2'

/**
 * !#en Test line and line
 * !#zh 测试线段与线段是否相交
 * @method lineLine
 * @param {Vec2} a1 - The start point of the first line
 * @param {Vec2} a2 - The end point of the first line
 * @param {Vec2} b1 - The start point of the second line
 * @param {Vec2} b2 - The end point of the second line
 * @return {boolean}
 */
export function lineLine ( a1, a2, b1, b2 ) {
    // b1->b2向量 与 a1->b1向量的向量积
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    // a1->a2向量 与 a1->b1向量的向量积
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    // a1->a2向量 与 b1->b2向量的向量积
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    // u_b == 0时，角度为0或者180 平行或者共线不属于相交
    if ( u_b !== 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            return true;
        }
    }

    return false;
}

/**
 * !#en Test line and rect
 * !#zh 测试线段与矩形是否相交
 * @method lineRect
 * @param {Vec2} a1 - The start point of the line
 * @param {Vec2} a2 - The end point of the line
 * @param {Rect} b - The rect
 * @return {boolean}
 */
export function lineRect ( a1, a2, b ) {
    var r0 = new Vec2( b.x, b.y );
    var r1 = new Vec2( b.x, b.yMax );
    var r2 = new Vec2( b.xMax, b.yMax );
    var r3 = new Vec2( b.xMax, b.y );

    if ( lineLine( a1, a2, r0, r1 ) )
        return true;
    if ( lineLine( a1, a2, r1, r2 ) )
        return true;
    if ( lineLine( a1, a2, r2, r3 ) )
        return true;
    if ( lineLine( a1, a2, r3, r0 ) )
        return true;
    return false;
}


