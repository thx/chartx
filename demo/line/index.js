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
var data1 = JSON.parse('[["日期","消耗"],["2015-03-20",9.39],["2011",8.95],["2015-03-22",8.13],["2015-03-23",9.56],["2015-03-24",8.87],["2015-03-25",8.32],["2015-03-26",8.33],["2015-03-20",9.39],["2011",8.95],["2015-03-22",8.13],["2015-03-23",9.56],["2015-03-24",8.87],["2015-03-25",8.32],["2015-03-26",8.33]]');
    var options = {
        back  : {
            yAxis     :{
                enabled  : 1
            }
        },
        yAxis : {
            //mode : 2, //去掉mode的配置，改为layoutdatafilter过滤的方式来自定义
            enabled : true,
            text:{
                fillStyle : '#666666'
            },
            //dataSection : [-80,-60,-40,-20,0,20,40,60,80],
            textFormat : function( text ){
                return text + "%"
            },
            line : {
                enabled : true,
            },
            //过滤器
            filter : function(e){
                //debugger
            },
            field : ["消耗"]//["val2" , "val3"]
        },
        xAxis : {
            // enabled : false,
            // dataSection : [0,0.5,1.0,1.5,2.0],
            text:{
                mode      : 1,
                rotation  : 30, 
                //dis       : 2,
                //fillStyle : '#000000'
            },
            filter : function(e){
                /*
                if( e.index == 0 ){
                    e.txt.context.visible = false;
                }
                */
            },
            field : ["日期"]//"val1"
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
