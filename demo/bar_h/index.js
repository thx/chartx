
KISSY.ready(function(){

    var S = KISSY;
    var data1= [
        ["y","line1","line2","line3"],
        [ '1-2K' , 101  , 201 , 0 ] ,
        [ '2-3K'  , 88 , 145 , 0 ] ,
        [ '3-4k' , 488  , 88  , 0 ] ,
        [ '4-5k'  , 390  , 546 , 0 ] ,
        [ '5-6k' , 1000  , 88  , 0 ] ,
        [ '6-7k'  , 390  , 546 , 0 ] ,
        [ '7-8k' , 201  , 101 , 0 ] ,
        [ '8-9k'  , 1145 , 145 , 0 ] ,
        [ '9-10k' , 488  , 88  , 0 ]
    ];
    var options = {
        yAxis : {
            field : ["y"],
            line:{
                width         : 4,
                height        : 1
            }
        },
        xAxis : {
            field : ["line1",'line2'],
            // disXAxisLine : 6,
            line:{
                width         : 3,
                height        : 6,
                strokeStyle   : '#cccccc'
            }
        },
        back :{
            xAxis:{
                enabled : 0
            },
            yAxis:{
                enabled :1,
                lineType:'dashed'
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

    KISSY.use("chartx/chart/bar_h/ , node" , function( S , Bar ){
        var bar = new Bar( S.all("#canvasTest") , data1 , options );
        bar.draw();
    });

    // Chartx.create.bar("canvasTest" , data1 , options).then(function( chart ){
    //     chart.draw();
    // })
});
