KISSY.ready(function(){

    var S = KISSY;
    var data1= [
        // y , x , size
        ["hot","recommend","num","info"],
        // [ 1  , 1  , 3794 , {name:'1-10周岁'} ],
        // [ 2 , 2  , 2243 , {name:'11-20周岁'} ],
        // [ 3 , 2  , 113 , {name:'21-30周岁'} ],
        // [ 4 , 3  , 3971 , {name:'31-40周岁'} ],
        // [ 5 , 4  , 3940 , {name:'41-50周岁'} ],
        // [ 6 , 5  , 511 , {name:'51-60周岁'} ],
        // [ 7 ,  6  , 1212 ,  {name:'61-70周岁'} ],
        // [ 8 ,  7  , 3495 ,  {name:'80周岁以上'} ],
        [ 2000  , 1  , 0 , {name:'15-18周岁'} ],
        [ 125 , 2  , 2243 , {name:'18-20周岁'} ],
        [ 976 , 12  , 0 , {name:'21-25周岁'} ],
        [ 111 , 3  , 3 , {name:'26-30周岁'} ],
        [ 555 , 4  , 3940 , {name:'31-35周岁'} ],
        [ 111 , 5  , 511 , {name:'36-40周岁'} ],
        [ 3060 ,  6  , 0 ,  {name:'50周岁上'} ],
        [ 2205 ,  17  , 3495 ,  {name:''} ],
        [ 3903 ,  8  , 4296 ,  {name:''} ],
        [ 149 ,  9  , 3757 ,  {name:''} ],
        [ 222 , 3  , 2 , {name:'26-30周岁'} ],
        [ 333 , 3  , 1 , {name:'26-30周岁'} ],
        [ 3984 ,  10  , 1679 ,  {name:''} ],
        // [ 2084 ,  11  , 3437 ,  {name:''} ],
        // [ 45 ,  12  , 1681 ,  {name:''} ],
        // [ 2611 ,  13  , 845 ,  {name:''} ],
        // [ 2000 ,  14  , 2011 ,  {name:''} ],
        // [ 290 ,  15  , 4977 ,  {name:''} ],
        // [ 926 ,  16  , 327 ,  {name:''} ],
        // [ 1026 ,  17  , 666 ,  {name:''} ],
        // [ 569 ,  18  , 569 ,  {name:''} ],
        // [ 1026 ,  18  , 1026 ,  {name:''} ],
        // [ 2 ,  18  , 926 ,  {name:''} ],
        // [ 3792 ,  19  , 2427 ,  {name:''} ],
        // [ 1404 ,  20  , 2566 ,  {name:''} ],
        // [ 4837 ,  21  , 3335 ,  {name:''} ],
        // [ 620 ,  22  , 2257 ,  {name:''} ],
        // [ 1425 ,  23  , 1902 ,  {name:''} ],
        // [ 1520 ,  24  , 239 ,  {name:''} ],
        // [ 999 ,  25  , 0 ,  {name:''} ]//,
        // [ 60 ,  26  , 99 ,  {name:''} ],
        // [ 60 ,  27  , 99 ,  {name:''} ],
        // [ 60 ,  28  , 99 ,  {name:''} ],
        // [ 60 ,  29  , 99 ,  {name:''} ]
    ];
    var options = {
        cx    : 30,                              //品牌圆心x坐标
        event : {
            enabled : 1,                              //是否有事件响应(tips)[1]
            on : function(o){
                //e.ringID = 第几个环(从0开始 0 = 品牌)   e.ID = 第几个行星(从1开始)
                console.log(o.orgData)
            }
        },

        yAxis : {                                //Y轴
            field : ["hot"]
        },
        xAxis : {
            field : "recommend"
        },
        graphs: {
            size  : {                            //行星大小
                field : 'num'
            },
            info  : {
                field : 'info',
                content : 'name'
            },             
            core  : {
                r     : {                       //品牌半径
                    normal  : 60
                },
                text  : {
                    content : '阿里妈妈'
                }
            },
            // fillStyle:{
            //     normals:function(o){
            //         return '#ff0000'
            //     }
            // }
        }
    }

    KISSY.use("chartx/chart/planet/, node" , function( S , Planet ){
        var planet = new Planet( S.all("#canvasTest") , data1 , options  );
        planet.draw();
    });
});
