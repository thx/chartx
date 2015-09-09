/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 数学 类
 *
 **/


define(
    "canvax/geom/Math",
    [],
    function(){
        var _cache = {
            sin : {},     //sin缓存
            cos : {}      //cos缓存
        };
        var _radians = Math.PI / 180;

        /**
         * @param angle 弧度（角度）参数
         * @param isDegrees angle参数是否为角度计算，默认为false，angle为以弧度计量的角度
         */
        function sin(angle, isDegrees) {
            angle = (isDegrees ? angle * _radians : angle).toFixed(4);
            if(typeof _cache.sin[angle] == 'undefined') {
                _cache.sin[angle] = Math.sin(angle);
            }
            return _cache.sin[angle];
        }

        /**
         * @param radians 弧度参数
         */
        function cos(angle, isDegrees) {
            angle = (isDegrees ? angle * _radians : angle).toFixed(4);
            if(typeof _cache.cos[angle] == 'undefined') {
                _cache.cos[angle] = Math.cos(angle);
            }
            return _cache.cos[angle];
        }

        /**
         * 角度转弧度
         * @param {Object} angle
         */
        function degreeToRadian(angle) {
            return angle * _radians;
        }

        /**
         * 弧度转角度
         * @param {Object} angle
         */
        function radianToDegree(angle) {
            return angle / _radians;
        }

        /*
         * 校验角度到360度内
         * @param {angle} number
         */
        function degreeTo360( angle ) {
            var reAng = (360 +  angle  % 360) % 360;//Math.abs(360 + Math.ceil( angle ) % 360) % 360;
            if( reAng == 0 && angle !== 0 ){
                reAng = 360
            }
            return reAng;
        }

        return {
            PI  : Math.PI  ,
            sin : sin      ,
            cos : cos      ,
            degreeToRadian : degreeToRadian,
            radianToDegree : radianToDegree,
            degreeTo360    : degreeTo360   
        };
 
    }
)
