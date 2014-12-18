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
        // title : "first charts",
        // disXAxisLine : 0,
        // disYAxisTopLine : 26,
        mode  : 1,                                     //模式( 1 = 正常(y轴在背景左侧) | 2 = 叠加(y轴叠加在背景上))[默认：1]

        event : {
            enabled : 1                                //是否有事件响应(tips)
        },

        yAxis : {
            mode   : 1,                                //模式( 1 = 正常 | 2 = 显示两条(最下面 + 最上面 且与背景线不对其))
            field : ["val4","val3"],
            // dataMode:0,
            line:{
                enabled : 0,
                // strokeStyle : '#ff0000'
            },
            text:{
                // fillStyle:'#ff0000',
                fontSize  : 12
            }
        },
        xAxis : {
            // field : "val2",
            disY: 6,
            dis : 6,
            line:{
                width   : 2,
                height  : 4,
                strokeStyle   : '#cccccc'
            },
            text:{
                mode      : 2,
                fontSize  : 10
            }
        },
        back : {
            xOrigin:{
                thinkness:1,
                strokeStyle : '#333333'
            },
            yOrigin:{
                enabled:0
            },
            xAxis:{
                // lineType: ''
                thinkness:1,
                strokeStyle : '#cccccc'
            },
            yAxis:{
                // enabled : 0
            }
        },
        graphs:{
            line:{
                strokeStyle : {
                    normals : ['#f8ab5e','#E55C5C'],
                },
                alpha       : {
                    normals : [0, 0],
                }
            }
        }
    }

    KISSY.config({
        packages: [{
            name  :  'chartx'  ,
            path  :  '../../',
            debug :  true
        }
        ]
    });

    KISSY.use("chartx/chart/line/ , node" , function( S , Line ){
        var line = new Line( S.all("#canvasTest") , data1 , options  );
        line.draw();
        window.line = line
        window.data1 = data1
        window.options = options
        options.yAxis.fields = ["val3","val2","val4"]
    });
});
