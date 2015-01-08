KISSY.ready(function(){

    var S = KISSY;
    var data1= [
        ["hot","recommend","num","info"],
        // [ 0 , 0,  , {name:'骆驼'} ],
        [ 125 , 1  , 678 , {name:'18-20周岁'} ],
        [ 125 , 2  , 333 , {name:'18-20周岁'} ],
        [ 976 , 2  , 998 , {name:'21-25周岁'} ],
        [ 314 , 3  , 3210 , {name:'26-30周岁'} ],
        [ 555 , 4  , 1587 , {name:'31-35周岁'} ],
        [ 111 , 5  , 342 , {name:'36-40周岁'} ],
        [ 60 ,  6  , 131 , {name:'41周岁以上'} ],
    ];
    // var data1 = [                                          //拐角有节点
    //     ['val1','val2'],
    //     [1, 179],
    //     [2, 179],
    //     [3, 179],
    //     [4, 179],
    //     [5, 179],
    //     [6, 179],
    //     [7, 179],
    // ]
    var options = {
        // title : "first charts",
        // disXAxisLine : 0,
        // disYAxisTopLine : 26,
        mode  : 1,                                     //模式( 1 = 正常(y轴在背景左侧) | 2 = 叠加(y轴叠加在背景上))[1]

        event : {
            enabled : 1                                //是否有事件响应(tips)[1]
        },

        yAxis : {                                //Y轴
            enabled: 1,                                //是否有y轴(1 = 有 | 0 = 无)[1]
            mode   : 1,                                //模式( 1 = 正常 | 2 = 显示两条(最下面 + 最上面 且与背景线不对其))[1]
            field : ["val2"],
            // field : ['val4','val3','val2'],
            // dataMode:0,
            line:{                                     //横向小线
                enabled : 0,                           
                // strokeStyle : '#ff0000'
            },
            text:{                                     //文字
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
                enabled:1,
                thinkness:1,
                strokeStyle : '#000000'
            },
            yOrigin:{
                enabled:0,
                strokeStyle : '#000000'
            },
            xAxis:{
                // lixneType: ''
                // thinkness:1,
                // strokeStyle : '#cccccc'
            },
            yAxis:{
                enabled : 0
            }
        },
        graphs:{
            line:{                               //线
                node : {                                   //节点        
                    enabled : 1,                           //是否有节点(1 = 有 | 0 = 无)[0]
                    mode    : 1,                           //模式(空|0 = 都有节点 | 1 = 拐角有节点)
                    r       : {                            //半径  注意：有几条线,有几个值
                        normals : [3,3,3],
                        // overs   : [2,5,2]                 
                    },                                     
                    fillStyle   :{                         //填充色  注意：有几条线,有几个值
                        // normals : ['#ff0000','#ff0000','#ff0000'],
                        // overs   : ['#ff0000','#ff0000','#ff0000']
                    },
                    strokeStyle :{                         //轮廓色  注意：有几条线,有几个值
                        // normals : ['#ff0000','#ff0000','#ff0000'],         
                        // overs : ['#ff0000','#ff0000','#ff0000']             
                    },
                    lineWidth   :{                         //轮廓粗细 注意：有几条线,有几个值
                        // normals : [2,2,2],      
                        // overs   : [2,5,2]      
                    }         
                },
                strokeStyle : {                            //线颜色  注意：有几条线,有几个值
                    //[ ['#458AE6', '#39BCC0', '#5BCB8A', '#94CC5C', '#C3CC5C', '#E6B522', '#E68422'] ]
                    // normals : ['#6f8cb2','#c77029','#f15f60'],
                    //[ ['#135EBF', '#2E9599', '#36B26A', '#78A64B', '#9CA632', '#BF9E39', '#BF7C39'] ]
                    // overs                               //*
                },
                alpha       : {                            //有填充时,透明度 注意：有几条线,有几个值
                    // normals : [0.1,0.1,0.1],
                    // overs                               //*
                }
            }
        }
    }

    // function test(){

    // }
    KISSY.config({
        packages: [{
            name  :  'chartx'  ,
            path  :  '../../',
            debug :  true
        }
        ]
    });

    KISSY.use("chartx/chart/planet/, node" , function( S , Planet ){
        var planet = new Planet( S.all("#canvasTest") , data1 , options  );
        planet.draw();


        planet.reset({data:data1, options:options, opts:{}})
    });
});
