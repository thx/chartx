
define('chartx/utils/math3d/Vector3',[
], function () {
    "use strict";
    var Vector3 = {};

    Vector3.makeZero = function (vec) {
        vec[0] = 0;
        vec[1] = 0;
        vec[2] = 0;
    }

    Vector3.create = function () {
        return [0, 0, 0];
    }

    Vector3.make = function (x, y, z) {
        return [x, y, z];
    }

    Vector3.assign = function (vec, x, y, z) {
        vec[0] = x;
        vec[1] = y;
        vec[2] = z;
    }

    Vector3.copy = function (vec) {
        var newObject = [0, 0, 0];
        newObject[0] = vec[0];
        newObject[1] = vec[1];
        newObject[2] = vec[2];
        return newObject;
    }

    Vector3.release = function () {

    }

    /**
     * Vector add
     * @param { Vector3 } retVal output vector3;
     * @param { Vector3 } vec1  input vector3;
     * @param { Vector3 } vec2  input vector3;
     */
    Vector3.add = function (retVal, vec1, vec2) {
        retVal[0] = vec1[0] + vec2[0];
        retVal[1] = vec1[1] + vec2[1];
        retVal[2] = vec1[2] + vec2[2];
    };

    /**
     *
     * @param retVal
     * @param vec1
     * @param vec2
     */
    Vector3.sub = function (retVal, vec1, vec2) {
        retVal[0] = vec1[0] - vec2[0];
        retVal[1] = vec1[1] - vec2[1];
        retVal[2] = vec1[2] - vec2[2];
        return retVal;
    };

    /**
     *
     * @param retVal
     * @param vec1
     * @param vec2
     */
    Vector3.multiply = function (retVal, vec1, vec2) {
        retVal[0] = vec1[0] * vec2[0];
        retVal[1] = vec1[1] * vec2[1];
        retVal[2] = vec1[2] * vec2[2];
    };

    /**
     *
     * @param retVal
     * @param vec1
     * @param scale
     */
    Vector3.scale = function (retVal, vec1, scale) {
        retVal[0] = vec1[0] * scale;
        retVal[1] = vec1[1] * scale;
        retVal[2] = vec1[2] * scale;

        return retVal;
    };

    /**
     *
     * @param retVal
     * @param vec
     */
    Vector3.normalize = function (retVal, vec) {
        var length = Vector3.length(vec);
        //if ( length > 0.000001 )
        if (length > 0.0) {
            var r = 1 / length;
            retVal[0] = (vec[0] * r);
            retVal[1] = (vec[1] * r);
            retVal[2] = (vec[2] * r);
        }
        return retVal;
    };

    /**
     *
     * @param vec1
     * @param vec2
     * @returns {number}
     */
    Vector3.dot = function (vec1, vec2) {
        return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
    };

    /**
     *
     * @param retVal
     * @param vec1
     * @param vec2
     */
    Vector3.cross = function (retVal, left, right) {
        /* retVal[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
         retVal[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
         retVal[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];  */
        var leftX = left[0];
        var leftY = left[1];
        var leftZ = left[2];
        var rightX = right[0];
        var rightY = right[1];
        var rightZ = right[2];

        var x = leftY * rightZ - leftZ * rightY;
        var y = leftZ * rightX - leftX * rightZ;
        var z = leftX * rightY - leftY * rightX;

        retVal[0] = x;
        retVal[1] = y;
        retVal[2] = z;

        return retVal;
    };

    /**
     *
     * @param retVal
     * @param vec
     * @param mat
     */
    Vector3.transformCoord = function (retVal, vec, mat) {
        var vX = vec[0];
        var vY = vec[1];
        var vZ = vec[2];
        var vW = 1.0;

        var x = mat[0] * vX + mat[4] * vY + mat[8] * vZ + mat[12] * vW;
        var y = mat[1] * vX + mat[5] * vY + mat[9] * vZ + mat[13] * vW;
        var z = mat[2] * vX + mat[6] * vY + mat[10] * vZ + mat[14] * vW;
        // var w = matrix[3] * vX + matrix[7] * vY + matrix[11] * vZ + matrix[15] * vW;

        retVal[0] = x;
        retVal[1] = y;
        retVal[2] = z;
        // result.w = w;
        return retVal;
    };

    /**
     *
     * @param retVal
     * @param vec
     * @param mat
     */
    Vector3.transformNormal = function (retVal, vec, mat) {
        var x = vec[0], y = vec[1], z = vec[2];
        retVal[0] = x * mat[0] + y * mat[4] + z * mat[8];
        retVal[1] = x * mat[1] + y * mat[5] + z * mat[9];
        retVal[2] = x * mat[2] + y * mat[6] + z * mat[10];
    };

    /**
     *
     * @param retVal
     * @param vec
     * @returns {number}
     */
    Vector3.length = function (vec) {
        /* if (typeof vec === 'undefined') {
         var temp = 0;
         }*/
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    };

    Vector3.distance = function (left, right) {
        return Math.sqrt((left[0] - right[0]) * (left[0] - right[0]) +
        (left[1] - right[1]) * (left[1] - right[1]) +
        (left[2] - right[2]) * (left[2] - right[2]));
    }
    /**
     *
     * @param retVal
     * @param vec
     * @returns {number}
     */
    Vector3.squaredLength = function (vec) {
        return vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2];
    };

    Vector3.clone = function (retVal, vec) {
        retVal[0] = vec[0];
        retVal[1] = vec[1];
        retVal[2] = vec[2];
        return retVal;
    };

    Vector3.equalsEpsilon = function (left, right, epsilon) {
        return (left === right) ||
            ( (Math.abs(left[0] - right[0]) <= epsilon) &&
            (Math.abs(left[1] - right[1]) <= epsilon) &&
            (Math.abs(left[2] - right[2]) <= epsilon));
    };

    Vector3.negate = function (retVal, vec) {
        retVal[0] = -vec[0];
        retVal[1] = -vec[1];
        retVal[2] = -vec[2];
        return retVal;
    };

    Vector3.abs = function (retVal, vec) {
        retVal[0] = Math.abs(vec[0]);
        retVal[1] = Math.abs(vec[1]);
        retVal[2] = Math.abs(vec[2]);
        return retVal;
    };

    Vector3.mad = function (retVal, vec1, vec2, t) {
        retVal[0] = vec1[0] + vec2[0] * t;
        retVal[1] = vec1[1] + vec2[1] * t;
        retVal[2] = vec1[2] + vec2[2] * t;
    };

    Vector3.transformCoordEx = function (retVal, vec, mat) {
        var vX = vec[0];
        var vY = vec[1];
        var vZ = vec[2];
        var vW = mat[3] * vX + mat[7] * vY + mat[11] * vZ + mat[15];
        var invW = 1 / vW;

        var x = (mat[0] * vX + mat[4] * vY + mat[8] * vZ + mat[12]) * invW;
        var y = (mat[1] * vX + mat[5] * vY + mat[9] * vZ + mat[13]) * invW;
        var z = (mat[2] * vX + mat[6] * vY + mat[10] * vZ + mat[14]) * invW;

        retVal[0] = x;
        retVal[1] = y;
        retVal[2] = z;
        return retVal;
    };
        /**
     * Transforms the vec4 with a mat4.
     *
     * @param {vec4} out the receiving vector
     * @param {vec4} a the vector to transform
     * @param {mat4} m matrix to transform with
     * @returns {vec4} out
     */

    Vector3.transformMat4 = function(out, a, m) {
        var x = a[0], y = a[1], z = a[2], w = a[3];
        out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
        return out;
    };

    Vector3.ZERO = [0.0, 0.0, 0.0];
    Vector3.UNIT_X = [1.0, 0.0, 0.0];
    Vector3.UNIT_Y = [0.0, 1.0, 0.0];
    Vector3.UNIT_Z = [0.0, 0.0, 1.0];

    return Vector3;
});