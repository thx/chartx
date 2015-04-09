

function del(){
    line.remove("val2");
}

function add(){
    line.add("val2" , 0)
}
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
            field : ["val2" , "val3"]
        },
        xAxis : {
            field : "val1"
        }
    }


    Chartx.create.line("canvasTest" , data1 , options).then(function( line ){
        window.line = line;
        line.draw();
    })
});
