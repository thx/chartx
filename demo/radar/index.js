
KISSY.ready(function(){

    var S = KISSY;
    window.data1= [
        [ "val1"     ,"val2","val3"] ,
        [ "Eating"   , 65   , 28   ] ,
        [ "Drinking" , 59   , 48   ] ,
        [ "Sleeping" , 90   , 40   ] ,
        [ "Designing", 81   , 19   ] ,
        [ "Coding"   , 56   , 96   ] ,
        [ "Cycling"  , 55   , 27   ] ,
        [ "Running"  , 40   , 100  ] 
    ];
    window.options = {
        yAxis : {
            field   : ["val2","val3"],
            dataSection : [0,40,80,100]
        },
        xAxis : {
            field : ["xfield"],
        },
        tips : {
            prefix : ["小明","小娜"]
            //context : function(info){
            //    debugger
            //}
        },
        back  : {
            //strokeStyle : "red"
            //r : 150 //蜘蛛网的半径，决定了整个图的大小默认为chart的min(width,height)
        },
        graphs:{
            fillStyle : ["red"]
            //alpha     : 0
        }
    }
    Chartx.create.radar("canvasTest" , data1 , options).then(function( chart ){
        chart.on("click" , function(){
        
        });
    })


});
