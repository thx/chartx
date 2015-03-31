
KISSY.ready(function(){

    var S = KISSY;
    var data1= [
        ["val1","val2","val3","val4"],
        [ 1 , 101  , 201 , 0 ] ,
        [ 2  , 0 , 145 , 0 ] ,
        [ 3 , 488  , 88  , 0 ] ,
        [ 4  , 390  , 546 , 0 ] ,
        [ 5 , 0  , 88  , 0 ] ,
        [ 6  , 390  , 546 , 0 ] ,
        [ 7 , 201  , 101 , 0 ] ,
        [8  , 1145 , 145 , 0 ] ,
        [ 9 , 488  , 88  , 0 ] ,
        [ "最后一天"  , 390  , 546 , 0 ]
    ];
    var options = {
        yAxis : {
            field : ["val3","val2"],
        },
        xAxis : {
            field : ["val1"],
            line:{
                strokeStyle   : '#cccccc'
            },
            text : {
            }
        },
        graphs:{
            bar : {
                fillStyle   : function(i , ii , value){
                    var colors = ['#f8ab5e','#E55C5C']
                    return colors[i]
                }
            },
            eventEnabled : true
        },
        tips  :{
            prefix : ["今天","昨天"]
        }
    }   

    KISSY.use("chartx/chart/bar/ , node" , function( S , Bar ){
        var bar = new Bar( S.all("#canvasTest") , data1 , options );
        bar.draw();
    });
});
