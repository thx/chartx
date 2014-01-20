
KISSY.ready(function(){

    var S = KISSY;
    var data1= [
["val1","val2","val3","val4"],
[ 1 , 201  , 101 , 500 ] ,
[ 2  , 0 , 145 , 100 ] ,
[ 3 , -488  , 88  , 700 ] ,
[ 4  , 390  , 546 , 300 ] ,
[ 5 , 0  , 88  , 700 ] ,
[ 6  , 390  , 546 , 300 ] ,
[ 7 , 201  , 101 , 500 ] ,
[8  , 1145 , 145 , 100 ] ,
[ 9 , 488  , 88  , 700 ] ,
[ 10  , 390  , 546 , 300 ],
[ 1 , 201  , 101 , 500 ] ,
[ 2  , 0 , 145 , 100 ] ,
[ 3 , -488  , 88  , 700 ] ,
[ 4  , 390  , 546 , 300 ] ,
[ 5 , 0  , 88  , 700 ] ,
[ 6  , 390  , 546 , 300 ] ,
[ 7 , 201  , 101 , 500 ] ,
[8  , 1145 , 145 , 100 ] ,
[ 9 , 488  , 88  , 700 ] ,
[ 10  , 390  , 546 , 300 ],
[ 1 , 201  , 101 , 500 ] ,
[ 2  , 0 , 145 , 100 ] ,
[ 3 , -488  , 88  , 700 ] ,
[ 4  , 390  , 546 , 300 ] ,
[ 5 , 0  , 88  , 700 ] ,
[ 6  , 390  , 546 , 300 ] ,
[ 7 , 201  , 101 , 500 ] ,
[8  , 1145 , 145 , 100 ] ,
[ 9 , 488  , 88  , 700 ] ,
[ 10  , 390  , 546 , 300 ]
    ];
var options = {
    //title : "first charts",
    xAxis : {
        field : "val4",
        TextStyle:{
            color : "black"
        },
        lineColor:'#ff0000',
        customPL:function(pointList){
            return [
                "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
                ]
        }
    },
    yAxis : {
        fields : ["val2"],
        dataMode:0
    },
    customPL : function( pointList ){
        var pl       = pointList.length;
        var brokenPlist  = [];
        S.each(pointList , function( p , i ){
            brokenPlist.push(p);
            var nextItem = (i >= pl-1) ? null : pointList[i+1];
            if( nextItem ){
                if( nextItem[1] != p[1] ) {
                    brokenPlist.push( [nextItem[0] , p[1]] );
                }
            }
        });
        return brokenPlist;
    }
}


KISSY.use("charts/ ,node" , function( S , Charts ){

    window.brokenLine = new Charts.BrokenLine( S.all("#canvasTest") );
    brokenLine.done( function( chart ){
        chart.draw( data1 , options );
    } );

});
});
