KISSY.ready(function(){

    var S = KISSY;
    var data1= [
        ["val1","val2","val3","val4"],
        [ 1 , 101  , 20 , 33 ] ,
        [ 2 , 67  , 51 , 26 ] ,
        [ 3 , 76  , 45 , 43 ] ,
        [ 4 , 58  , 35 , 31 ] ,
        [ 5 , 79  , 73 , 71 ] ,
        [ 6 , 88  , 54 , 39 ] ,
        [ 7 , 56  , 68 , 65 ] ,
        [ 8 , 99  , 83 , 51 ] 
    ];
    var options = {
        back  : {
            yAxis     :{
                enabled  : 1
            }
        },
        yAxis : {
            enabled : true,
            text:{
                fillStyle : '#666666'
            },
            //dataSection : [-80,-60,-40,-20,0,20,40,60,80],
            textFormat : function( text ){
                return text + "%"
            },
            field : ["val2" , "val3"]
        },
        xAxis : {
            // enabled : false,
            // dataSection : [0,0.5,1.0,1.5,2.0],
            text:{
                mode      : 1,
                //dis       : 2,
                fillStyle : '#000000'
            },
            field : "val1"
        },
        graphs : {
            line : {
                lineWidth : 0 
            }
        }
    }
    // KISSY.config({
    //     packages: [{
    //         name  :  'chartx'  ,
    //         path  :  '../../',
    //         debug :  true
    //     }
    //     ]
    // });

    KISSY.use("chartx/chart/line/ , node" , function( S , Line ){
        window.line = new Line( S.all("#canvasTest") , data1 , options  );
        line.draw();
    });
});
