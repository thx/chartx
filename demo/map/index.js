function domready(){
   
    var data = [
        [ "area"   , "click" ],
        [ "广东省" , 111 ],
        [ "浙江省" , 100 ],
        [ "湖南省" , 80 ],
        [ "湖北省" , 9 ]
    ];

    var options = {
        areaField : "area", //可选，默认为第一个字段
        area : {
            normal : {
                fillStyle : function( area ){
                   if( area ){
                       if( area[1] > 100 ){
                           return "#135EBF"
                       }
                   }
                }
            },
            hover : {
                strokeStyle : function( area ){
                   if( area ){
                       if( area[1] > 100 ){
                           return "#135EBF"
                       } else {
                           return "#ffffff"
                       }
                   } else {
                       return "#ffffff"
                   } 
                },

                fillStyle : function( area ){
                   if( area ){
                       if( area[1] > 100 ){
                           return "#458AE6"
                       }
                   }
                }
            }
        },
        tips : {
            field  : ["click"],//可选，默认为除开areaField外的所有字段
            prefix : ["点击量"]
        } 
    };

    require("chartx/chart/map/index" , function( Map ){
        var map = new Map("canvasTest" , data , options);
        map.draw();
    });

}
