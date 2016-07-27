define('chartx/utils/math3d/Matrix',
    [
    './Vector3'
], function (Vector3) {
    "use strict";

    var Matrix = {};
    Matrix.EPSILON = 0.000001;
    Matrix.release = function () {
    };

    /**
     *
     * @param mat
     */
    Matrix.makeIdentity = function (mat) {
        mat[0] = 1;
        mat[1] = 0;
        mat[2] = 0;
        mat[3] = 0;
        mat[4] = 0;
        mat[5] = 1;
        mat[6] = 0;
        mat[7] = 0;
        mat[8] = 0;
        mat[9] = 0;
        mat[10] = 1;
        mat[11] = 0;
        mat[12] = 0;
        mat[13] = 0;
        mat[14] = 0;
        mat[15] = 1;
    };

    Matrix.create = function () {
        return [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1];
    }

    /**
     *
     * @param array
     * @returns {{stack: Array, push: Function, pop: Function}}
     */
    Matrix.makeMatrixStack = function (array) {
        var stk = [];
        stk.top = 0;
        return {
            stack: stk,
            push: function () {
                var bt = this.stack;
                if (bt.top < bt.length) {
                    return bt[bt.top++];
                }
                var bu = new array(16);
                bt[bt.top] = bu;
                if (++bt.top > 100) {
                    console.log("error: matrix stack overflow!");
                }
                return bu;
            },
            pop: function () {
                if (--this.stack.top < 0) {
                    console.log("error: matrix stack underflow");
                }
            }
        };
    };

    /**
     * Matrix Multiply
     * @param { Matrix } out output matrix;
     * @param { Matrix } a  input matrix1;
     * @param { Matrix } b  input matrix2;
     */
    Matrix.multiply = function (out, a, b) {
          var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        // Cache only the current line of the second matrix
        var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
        out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
        out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
        out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
        return out;
    };

    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {vec3} eye Position of the viewer
     * @param {vec3} center Point the viewer is looking at
     * @param {vec3} up vec3 pointing up
     * @returns {mat4} out
     */

    Matrix.lookatRH = function (out, eye, center, up) {
         var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
            eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2],
            centerx = center[0],
            centery = center[1],
            centerz = center[2];

        if (Math.abs(eyex - centerx) < Matrix.EPSILON &&
            Math.abs(eyey - centery) < Matrix.EPSILON &&
            Math.abs(eyez - centerz) < Matrix.EPSILON) {
            return Matrix.makeIdentity(out);
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        out[0] = x0;
        out[1] = y0;
        out[2] = z0;
        out[3] = 0;
        out[4] = x1;
        out[5] = y1;
        out[6] = z1;
        out[7] = 0;
        out[8] = x2;
        out[9] = y2;
        out[10] = z2;
        out[11] = 0;
        out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out[15] = 1;

        return out;
    };
    /**
     * Generates a perspective projection matrix with the given bounds
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {number} fovy Vertical field of view in radians
     * @param {number} aspect Aspect ratio. typically viewport width/height
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {mat4} out
     */
    Matrix.perspectiveRH = function (out, fovy, aspect, near, far) {
        var f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far);
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = (2 * far * near) * nf;
        out[15] = 0;
        return out;
    };
    /**
     * Generates a orthogonal projection matrix with the given bounds
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {number} left Left bound of the frustum
     * @param {number} right Right bound of the frustum
     * @param {number} bottom Bottom bound of the frustum
     * @param {number} top Top bound of the frustum
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {mat4} out
     */
    Matrix.orthoRH = function (out, left, right, bottom, top, near, far) {
        //var tan_fovy = 1 / Math.tan(fovy * 0.5);
        var lr = 1 / (left - right),
            bt = 1 / (bottom - top),
            nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
    };

    Matrix.fromTNBP = function (retVal, xAxis, yAxis, zAxis, vecP) {
        retVal[0] = xAxis[0], retVal[1] = xAxis[1], retVal[2] = xAxis[2], retVal[3] = 0;
        retVal[4] = yAxis[0], retVal[5] = yAxis[1], retVal[6] = yAxis[2], retVal[7] = 0;
        retVal[8] = zAxis[0], retVal[9] = zAxis[1], retVal[10] = zAxis[2], retVal[11] = 0;
        retVal[12] = vecP[0], retVal[13] = vecP[1], retVal[14] = vecP[2], retVal[15] = 1;

        return retVal;
    };
/**
     * Translate a mat4 by the given vector not using SIMD
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to translate
     * @param {vec3} v vector to translate by
     * @returns {mat4} out
     */
    Matrix.translate = function (out, a, v) {
        var x = v[0], y = v[1], z = v[2],
            a00, a01, a02, a03,
            a10, a11, a12, a13,
            a20, a21, a22, a23;

        if (a === out) {
            out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
            out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
            out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
            out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
        } else {
            a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
            a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
            a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

            out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
            out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
            out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

            out[12] = a00 * x + a10 * y + a20 * z + a[12];
            out[13] = a01 * x + a11 * y + a21 * z + a[13];
            out[14] = a02 * x + a12 * y + a22 * z + a[14];
            out[15] = a03 * x + a13 * y + a23 * z + a[15];
        }

        return out;
    };
/**
     * Scales the mat4 by the dimensions in the given vec3 not using vectorization
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to scale
     * @param {vec3} v the vec3 to scale the matrix by
     * @returns {mat4} out
     **/
    Matrix.scale = function (out, a, v) {
         var x = v[0], y = v[1], z = v[2];

        out[0] = a[0] * x;
        out[1] = a[1] * x;
        out[2] = a[2] * x;
        out[3] = a[3] * x;
        out[4] = a[4] * y;
        out[5] = a[5] * y;
        out[6] = a[6] * y;
        out[7] = a[7] * y;
        out[8] = a[8] * z;
        out[9] = a[9] * z;
        out[10] = a[10] * z;
        out[11] = a[11] * z;
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
    };
    /**
     * Rotates a matrix by the given angle around the X axis not using SIMD
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    Matrix.rotateAxisX = function (out, a, rad) {
       var s = Math.sin(rad),
            c = Math.cos(rad),
            a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7],
            a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];

        if (a !== out) { // If the source and destination differ, copy the unchanged rows
            out[0]  = a[0];
            out[1]  = a[1];
            out[2]  = a[2];
            out[3]  = a[3];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }

        // Perform axis-specific matrix multiplication
        out[4] = a10 * c + a20 * s;
        out[5] = a11 * c + a21 * s;
        out[6] = a12 * c + a22 * s;
        out[7] = a13 * c + a23 * s;
        out[8] = a20 * c - a10 * s;
        out[9] = a21 * c - a11 * s;
        out[10] = a22 * c - a12 * s;
        out[11] = a23 * c - a13 * s;
        return out;
    };
/**
     * Rotates a matrix by the given angle around the Y axis not using SIMD
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    Matrix.rotateAxisY = function (out, a, rad) {
       var s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3],
            a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];

        if (a !== out) { // If the source and destination differ, copy the unchanged rows
            out[4]  = a[4];
            out[5]  = a[5];
            out[6]  = a[6];
            out[7]  = a[7];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }

        // Perform axis-specific matrix multiplication
        out[0] = a00 * c - a20 * s;
        out[1] = a01 * c - a21 * s;
        out[2] = a02 * c - a22 * s;
        out[3] = a03 * c - a23 * s;
        out[8] = a00 * s + a20 * c;
        out[9] = a01 * s + a21 * c;
        out[10] = a02 * s + a22 * c;
        out[11] = a03 * s + a23 * c;
        return out;
    };
    /**
     * Rotates a matrix by the given angle around the Z axis not using SIMD
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    Matrix.rotateAxisZ = function (out, a, rad) {
var s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3],
            a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7];

        if (a !== out) { // If the source and destination differ, copy the unchanged last row
            out[8]  = a[8];
            out[9]  = a[9];
            out[10] = a[10];
            out[11] = a[11];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }

        // Perform axis-specific matrix multiplication
        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a10 * c - a00 * s;
        out[5] = a11 * c - a01 * s;
        out[6] = a12 * c - a02 * s;
        out[7] = a13 * c - a03 * s;
        return out;
    };
/**
     * Rotates a mat4 by the given angle around the given axis
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @param {vec3} axis the axis to rotate around
     * @returns {mat4} out
     */
    Matrix.rotateAxis = function (out, a, rad, axis) {
        var x = axis[0], y = axis[1], z = axis[2],
            len = Math.sqrt(x * x + y * y + z * z),
            s, c, t,
            a00, a01, a02, a03,
            a10, a11, a12, a13,
            a20, a21, a22, a23,
            b00, b01, b02,
            b10, b11, b12,
            b20, b21, b22;

        if (Math.abs(len) < Matrix.EPSILON) { return null; }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        // Construct the elements of the rotation matrix
        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;

        if (a !== out) { // If the source and destination differ, copy the unchanged last row
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }
        return out;
    };

    Matrix.fromQuaternion = function (retVal, q) {
        var x = q[0], y = q[1], z = q[2], w = q[3];
        var xx = x * x;
        var xy = x * y;
        var xz = x * z;
        var xw = x * w;

        var yy = y * y;
        var yz = y * z;
        var yw = y * w;

        var zz = z * z;
        var zw = z * w;

        retVal[0] = 1 - 2 * ( yy + zz );
        retVal[1] = 2 * ( xy + zw );
        retVal[2] = 2 * ( xz - yw );

        retVal[4] = 2 * ( xy - zw );
        retVal[5] = 1 - 2 * ( xx + zz );
        retVal[6] = 2 * ( yz + xw );

        retVal[8] = 2 * ( xz + yw );
        retVal[9] = 2 * ( yz - xw );
        retVal[10] = 1 - 2 * ( xx + yy );

        retVal[3] = retVal[7] = retVal[11] = retVal[12] = retVal[13] = retVal[14] = 0;
        retVal[15] = 1;
    };

    Matrix.inverse = function (result, matrix) {
        var matrix0 = matrix[0];
        var matrix1 = matrix[1];
        var matrix2 = matrix[2];
        var matrix4 = matrix[4];
        var matrix5 = matrix[5];
        var matrix6 = matrix[6];
        var matrix8 = matrix[8];
        var matrix9 = matrix[9];
        var matrix10 = matrix[10];

        var vX = matrix[12];
        var vY = matrix[13];
        var vZ = matrix[14];

        var x = -matrix0 * vX - matrix1 * vY - matrix2 * vZ;
        var y = -matrix4 * vX - matrix5 * vY - matrix6 * vZ;
        var z = -matrix8 * vX - matrix9 * vY - matrix10 * vZ;

        result[0] = matrix0;
        result[1] = matrix4;
        result[2] = matrix8;
        result[3] = 0.0;
        result[4] = matrix1;
        result[5] = matrix5;
        result[6] = matrix9;
        result[7] = 0.0;
        result[8] = matrix2;
        result[9] = matrix6;
        result[10] = matrix10;
        result[11] = 0.0;
        result[12] = x;
        result[13] = y;
        result[14] = z;
        result[15] = 1.0;
        return result;
    };
    /**
     * Transpose the values of a mat4 not using SIMD
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the source matrix
     * @returns {mat4} out
     */

    Matrix.transpose = function (out, a) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
            var a01 = a[1], a02 = a[2], a03 = a[3],
                a12 = a[6], a13 = a[7],
                a23 = a[11];

            out[1] = a[4];
            out[2] = a[8];
            out[3] = a[12];
            out[4] = a01;
            out[6] = a[9];
            out[7] = a[13];
            out[8] = a02;
            out[9] = a12;
            out[11] = a[14];
            out[12] = a03;
            out[13] = a13;
            out[14] = a23;
        } else {
            out[0] = a[0];
            out[1] = a[4];
            out[2] = a[8];
            out[3] = a[12];
            out[4] = a[1];
            out[5] = a[5];
            out[6] = a[9];
            out[7] = a[13];
            out[8] = a[2];
            out[9] = a[6];
            out[10] = a[10];
            out[11] = a[14];
            out[12] = a[3];
            out[13] = a[7];
            out[14] = a[11];
            out[15] = a[15];
        }

        return out;
    };

    Matrix.clone = function (result, matrix) {
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = matrix[15];
        return result;
    };

    //-----------------------------------------------------------------------
    Matrix.toEulerAnglesZXY = function (result, matrix) {

        //   Radian& rfYAngle, Radian& rfPAngle, Radian& rfRAngle
        // rot =  cy*cz-sx*sy*sz -cx*sz           cz*sy+cy*sx*sz
        //        cz*sx*sy+cy*sz  cx*cz          -cy*cz*sx+sy*sz
        //       -cx*sy           sx              cx*cy

        result[1] = Math.asin(matrix[6]);
        if (result[1] < (Math.PI * 0.5)) {
            if (result[1] > (-Math.PI * 0.5)) {
                result[0] = Math.atan2(-matrix[4], matrix[5]);
                result[2] = Math.atan2(-matrix[2], matrix[10]);
                return true;
            }
            else {
                // WARNING.  Not a unique solution.
                var fRmY = Math.atan2(matrix[8], matrix[0]);
                result[2] = 0.0;  // any angle works
                result[0] = result[2] - fRmY;
                return false;
            }
        }
        else {
            // WARNING.  Not a unique solution.
            var fRpY = Math.atan2(matrix[8], matrix[0]);
            result[2] = 0.0;  // any angle works
            result[0] = fRpY - result[2];
            return false;
        }
    };

    return Matrix;
});