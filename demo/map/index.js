function domready(){
   
    var data = [];
    var options = {};

    require("chartx/chart/map/index" , function( Map ){
        var map = new Map("canvasTest" , data , options);
        map.draw();
    });

}
