function domready(){
   
    var data = [];
    var options = {};

    require("dvix/chart/map/index" , function( Map ){
        var map = new Map("canvasTest" , data , options);
        map.draw();
    });

}
