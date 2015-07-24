KISSY.ready(function(){

    var S = KISSY;
    
    var data1= [
        // y , x , size
        ["tagId","recommend","num","info"],
        [ 1  , 1  , 3794 , {name:'1-10周岁'} ],
        [ 2 , 2  , 2243 , {name:'11-20周岁'} ],
        [ 3 , 2  , 113 , {name:'21-30周岁'} ],
        [ 4 , 3  , 3971 , {name:'31-40周岁'} ],
        [ 5 , 4  , 3940 , {name:'41-50周岁'} ],
        [ 6 , 5  , 511 , {name:'51-60周岁'} ],
        [ 7 ,  6  , 1212 ,  {name:'61-70周岁'} ],
        [ 8 ,  7  , 3495 ,  {name:'80周岁以上'} ],
    ];
    
    var data2 = [
        ["tagId","recommend","num","info"],
        [10022,4,3939,{"name":"Sarah Johnson","tagId":10022}],
        [10022,4,3939,{"name":"Sarah Johnson","tagId":10022}],
        [10012,12,1,{"name":"Nancy Rodriguez","tagId":10012}],
        [10019,16,6612,{"name":"Laura Allen","tagId":10019}],
        [10014,23,3909,{"name":"Brian Brown","tagId":10014}],
        [10035,26,8733,{"name":"Shirley White","tagId":10035}],
        [10016,27,9161,{"name":"Susan Gonzalez","tagId":10016}],
        [10031,32,7427,{"name":"Kevin Lewis","tagId":10031}],
        [10018,33,6292,{"name":"Betty Martinez","tagId":10018}],
        [10023,35,82,{"name":"Elizais","tagId":10020}],
        [10021,71,3333,{"name":"Ronald Lopez","tagId":10021}],
        [10015,73,222,{"name":"Richard Martinez","tagId":10015}],
        [10024,82,4379,{"name":"James Anderson","tagId":10024}],
        [10024,82,4379,{"name":"James Anderson","tagId":10024}],
        [10033,84,2714,{"name":"Carol Johnson","tagId":10033}],
        [10033,84,2714,{"name":"Carol Johnson","tagId":10033}],
        [10033,84,2714,{"name":"Carol Johnson","tagId":10033}],
        [10033,84,2714,{"name":"Carol Johnson","tagId":10033}],
        [10033,84,2714,{"name":"Carol Johnson","tagId":10033}],
        [10013,92,4603,{"name":"Edward Miller","tagId":10013}],
        [10032,92,7002,{"name":"Mark Williams","tagId":10032}],
        [10011,92,140,{"name":"Ruth Williams","tagId":10011}],
        [10011,92,200,{"name":"Ruth Williams","tagId":10011}],
        [10011,92,200,{"name":"Ruth Williams","tagId":10011}],
        [10011,92,200,{"name":"Ruth Williams","tagId":10011}],
        [10034,97,0,{"name":'',"tagId":10034}]
        // [10034,98,0,{"name":'',"tagId":10034}]
        // [1,4,3939,{"name":"Sarah Johnson","tagId":10022}],
        // [2,12,8835,{"name":"Nancy Rodriguez","tagId":10012}],
        // [3,16,6612,{"name":"Laura Allen","tagId":10019}],
        // [4,23,3909,{"name":"Brian Brown","tagId":10014}],
        // [5,26,8733,{"name":"Shirley White","tagId":10035}],
        // [6,27,9161,{"name":"Susan Gonzalez","tagId":10016}],
        // [7,32,7427,{"name":"Kevin Lewis","tagId":10031}],
        // [8,33,6292,{"name":"Betty Martinez","tagId":10018}],
        // [9,35,82,{"name":"Elizais","tagId":10020}],
        // [10,71,3333,{"name":"Ronald Lopez","tagId":10021}],
        // [11,73,222,{"name":"Richard Martinez","tagId":10015}],
        // [12,82,4379,{"name":"James Anderson","tagId":10024}],
        // [13,84,2714,{"name":"Carol Johnson","tagId":10033}],
        // [14,92,4603,{"name":"Edward Miller","tagId":10013}],
        // [15,92,7002,{"name":"Mark Williams","tagId":10032}],
        // [16,92,140,{"name":"Ruth Williams","tagId":10011}],
        // [17,97,9807,{"name":"Ruth White","tagId":10034}]] 
    ]
    // var data1 = 
    // [["tagId","recommend","num","info"],[0,5,100,{"name":"111486","tagId":0}],[1,1,78,{"name":"111488","tagId":1}],[2,10,40,{"name":"111487","tagId":2}],[3,23,25,{"name":"111922","tagId":3}],[4,1,18,{"name":"111491","tagId":4}],[5,6,13,{"name":"111545","tagId":5}],[6,6,13,{"name":"112065","tagId":6}],[7,6,13,{"name":"112124","tagId":7}],[8,6,13,{"name":"112070","tagId":8}],[9,50,9,{"name":"111544","tagId":9}],[10,51,9,{"name":"111489","tagId":10}],[11,41,7,{"name":"111558","tagId":11}],[12,22,6,{"name":"112067","tagId":12}],[13,22,6,{"name":"112126","tagId":13}],[14,22,6,{"name":"111559","tagId":14}],[15,22,6,{"name":"112072","tagId":15}],[16,66,6,{"name":"111688","tagId":16}],[17,33,2,{"name":"112066","tagId":17}],[18,20,2,{"name":"111641","tagId":18}],[19,33,2,{"name":"111539","tagId":19}],[20,33,2,{"name":"112125","tagId":20}],[21,33,2,{"name":"112071","tagId":21}],[22,38,2,{"name":"111640","tagId":22}],[23,40,2,{"name":"111542","tagId":23}],[24,48,2,{"name":"111543","tagId":24}],[25,36,1,{"name":"111560","tagId":25}],[26,47,1,{"name":"111642","tagId":26}],[27,58,1,{"name":"111541","tagId":27}],[28,62,1,{"name":"111689","tagId":28}],[29,67,1,{"name":"111643","tagId":29}]]


    // var options = {"cx":30,"event":{"enabled":1},"yAxis":{"field":["tagId"]},"xAxis":{"field":"recommend","bar":{"enabled":1,"y":275,"x":25,"width":1104,"fillStyle":{"normal":["#70649a","#b28fce"]},"text":{"contents":["高偏好度","低偏好度"]}}},"graphs":{"disY":20,"minR":6,"maxR":50,"layout":{"mode":1},"size":{"field":"num"},"info":{"field":"info","content":"name"},"core":{"r":{"normal":60},"text":{"content":"美的中创专\n卖店"}},"text":{"fillStyle":{"normal":"#666"}}},"back":{"space":150}}
    var options = {
        cx    : 30,                              //圆心坐标x
        event : {
            enabled : 1,                              //是否有事件响应(tips)[1]
            on : function(o){
                //e.ringID = 第几个环(从0开始 0 = 品牌)   e.ID = 第几个行星(从1开始)
                console.log(o)
            }
        },

        yAxis : {                                //Y轴
            field : ["tagId"]
        },
        xAxis : {
            field : "recommend",
            bar   : {
                enabled   : 1,
                y         : 428,
                x         : 50 / 2,
                width     : 1000 - 50,
                fillStyle : {
                    normal : ['#70649a', '#b28fce']
                },
                text      : {
                    contents : ['极力推荐','一般推荐']
                }
            }
        },
        graphs: {
            disY  : 10,                               //行星与容器上、下之间的最小距离
            minR  : 10,
            size  : {                                 //行星大小
                field : 'num'
            },
            layout: {                                 //布局
                mode  : 1                                  //模式(0 = 根据yAxis.field计算比例  |  1 = 上下错开)
            },
            info  : {
                field : 'info',
                content : 'name'
            },             
            core  : {                                 //品牌
                r     : {                                  //半径
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
            text  : {
                fillStyle : {
                    normal : '#0000ff'
                }
            }
        },
        back:{
            space  : 150
        }
    }

    Chartx.planet("canvasTest" , data1 , options);
});
