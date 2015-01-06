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
        yAxis : {
            field : ["val4","val3",'val2']
        },
        xAxis : {
            field : "val2"
        },
        graphs:{
            line:{
                strokeStyle : {
                    normals : ["#6f8cb2" , "#c77029" , "#f15f60" ],
                },
                alpha       : {
                    normals : [0.1, 0.1 , 0.1 ],
                }
            }
        }
    }

    KISSY.use("chartx/chart/line/ , node" , function( S , Line ){
        var line = new Line( S.all("#canvasTest") , data1 , options  );
        line.draw();
    });
});
