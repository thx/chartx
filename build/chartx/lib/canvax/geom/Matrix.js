
/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * Matrix 矩阵库 用于整个系统的几何变换计算
 * code from http://evanw.github.io/lightgl.js/docs/matrix.html
 */
define(
    "canvax/geom/Matrix",
    [
        "canvax/core/Base"
    ],
    function(Base){
  
        var Matrix = function(a, b, c, d, tx, ty){
            this.a = a != undefined ? a : 1;
            this.b = b != undefined ? b : 0;
            this.c = c != undefined ? c : 0;
            this.d = d != undefined ? d : 1;
            this.tx = tx != undefined ? tx : 0;
            this.ty = ty != undefined ? ty : 0;
        };
    
        Base.creatClass( Matrix , function(){} , {
            concat : function(mtx){
                var a = this.a;
                var c = this.c;
                var tx = this.tx;
    
                this.a = a * mtx.a + this.b * mtx.c;
                this.b = a * mtx.b + this.b * mtx.d;
                this.c = c * mtx.a + this.d * mtx.c;
                this.d = c * mtx.b + this.d * mtx.d;
                this.tx = tx * mtx.a + this.ty * mtx.c + mtx.tx;
                this.ty = tx * mtx.b + this.ty * mtx.d + mtx.ty;
                return this;
            },
            concatTransform : function(x, y, scaleX, scaleY, rotation){
                var cos = 1;
                var sin = 0;
                if(rotation%360){
                    var r = rotation * Math.PI / 180;
                    cos = Math.cos(r);
                    sin = Math.sin(r);
                }
    
                this.concat(new Matrix(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y));
                return this;
            },
            rotate : function(angle){
                //目前已经提供对顺时针逆时针两个方向旋转的支持
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
    
                var a = this.a;
                var c = this.c;
                var tx = this.tx;
    
                if (angle>0){
                    this.a = a * cos - this.b * sin;
                    this.b = a * sin + this.b * cos;
                    this.c = c * cos - this.d * sin;
                    this.d = c * sin + this.d * cos;
                    this.tx = tx * cos - this.ty * sin;
                    this.ty = tx * sin + this.ty * cos;
                } else {
                    var st = Math.sin(Math.abs(angle));
                    var ct = Math.cos(Math.abs(angle));
    
                    this.a = a*ct + this.b*st;
                    this.b = -a*st + this.b*ct;
                    this.c = c*ct + this.d*st;
                    this.d = -c*st + ct*this.d;
                    this.tx = ct*tx + st*this.ty;
                    this.ty = ct*this.ty - st*tx;
                }
                return this;
            },
            scale : function(sx, sy){
                this.a *= sx;
                this.d *= sy;
                this.tx *= sx;
                this.ty *= sy;
                return this;
            },
            translate : function(dx, dy){
                this.tx += dx;
                this.ty += dy;
                return this;
            },
            identity : function(){
                //初始化
                this.a = this.d = 1;
                this.b = this.c = this.tx = this.ty = 0;
                return this;
            },
            invert : function(){
                //逆向矩阵
                var a = this.a;
                var b = this.b;
                var c = this.c;
                var d = this.d;
                var tx = this.tx;
                var i = a * d - b * c;
    
                this.a = d / i;
                this.b = -b / i;
                this.c = -c / i;
                this.d = a / i;
                this.tx = (c * this.ty - d * tx) / i;
                this.ty = -(a * this.ty - b * tx) / i;
                return this;
            },
            clone : function(){
                return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
            },
            toArray : function(){
                return [ this.a , this.b , this.c , this.d , this.tx , this.ty ];
            },
            /**
             * 矩阵左乘向量
             */
            mulVector : function(v) {
                var aa = this.a, ac = this.c, atx = this.tx;
                var ab = this.b, ad = this.d, aty = this.ty;
    
                var out = [0,0];
                out[0] = v[0] * aa + v[1] * ac + atx;
                out[1] = v[0] * ab + v[1] * ad + aty;
    
                return out;
            }    
        } );
    
        return Matrix;
    
    }
);
