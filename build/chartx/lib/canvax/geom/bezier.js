define(
    "canvax/geom/bezier",
    [],
    function(){
        return {
            /**
             * @param  {number} -- t {0, 1}
             * @return {Point}  -- return point at the given time in the bezier arc
             */
            getPointByTime: function(t , plist) {
                var it = 1 - t,
                it2 = it * it,
                it3 = it2 * it;
                var t2 = t * t,
                t3 = t2 * t;
                var xStart=plist[0],yStart=plist[1],cpX1=plist[2],cpY1=plist[3],cpX2=0,cpY2=0,xEnd=0,yEnd=0;
                if(plist.length>6){
                    cpX2=plist[4];
                    cpY2=plist[5];
                    xEnd=plist[6];
                    yEnd=plist[7];
                    //三次贝塞尔
                    return { 
                        x : it3 * xStart + 3 * it2 * t * cpX1 + 3 * it * t2 * cpX2 + t3 * xEnd,
                        y : it3 * yStart + 3 * it2 * t * cpY1 + 3 * it * t2 * cpY2 + t3 * yEnd
                    }
                } else {
                    //二次贝塞尔
                    xEnd=plist[4];
                    yEnd=plist[5];
                    return {
                        x : it2 * xStart + 2 * t * it * cpX1 + t2*xEnd,
                        y : it2 * yStart + 2 * t * it * cpY1 + t2*yEnd
                    }
                };
            }
        }
    }
);
