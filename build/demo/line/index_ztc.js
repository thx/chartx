KISSY.ready(function(){

    var S = KISSY;
    // var data1= [
    //     ["val1","val2","val3","val4"],
    //     [ 1 , 101  , 20 , 33 ] ,
    //     [ 2 , 67  , 51 , 26 ] ,
    //     [ 3 , 76  , 45 , 43 ] ,
    //     [ 4 , 58  , 35 , 31 ] ,
    //     [ 5 , 79  , 73 , 71 ] ,
    //     [ 6 , 88  , 54 , 39 ] ,
    //     [ 7 , 56  , 68 , 65 ] ,
    //     [ 8 , 99  , 83 , 51 ] 
    // ];
//179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,76.43,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8,179.8
    var data1 = [                                          //拐角有节点
        ['val1','val2'],
        [1, 179],
        [2, 179],
        [3, 179],
        [4, 179],
        [5, 179],
        [6, 179],
        [7, 179],
        [8, 179],
        [9, 179],
        [10, 179],
        [11, 76],
        [12, 43],
        [13, 100],
        [14, 100],
        [15, 100],
        [16, 100],
        [17, 100],
        [18, 179],
        [19, 179],
        [20, 179],
    ]

     var data1 = [
             [ "date"       , "uv1" , "uv3" , "uv2" ],
             [ "2014-12-24" , 10        ,  0         , 0 ],
             [ "2014-12-25" , 30        ,  0         , 0 ],
             [ "2014-12-26" , 20        ,  0         , 0 ],
         ]
    var data1 = [
       [ "date"       , "line1" , "line2" , "line3" ],
       [ "0.1"        , -28        ,  200         , 300 ],
       [ "0.2"        , -26        ,  200         , 300 ],
       [ "0.3"        , -24        ,  200         , 300 ],
       [ "0.4"        , -22        ,  200         , 300 ],
       [ "0.5"        , -20        ,  250         , 100 ],
       [ "0.6"        , -16        ,  260         , 180 ],
       [ "0.7"        , -12        ,  260         , 180 ],
       [ "0.8"        , -8         ,  260         , 180 ],
       [ "0.9"        , -4         ,  260         , 180 ],
       [ "1.0"        , 0          ,  260         , 180 ],
       [ "1.1"        , 10         ,  260         , 180 ],
       [ "1.2"        , 14         ,  260         , 180 ],
       [ "1.3"        , 18         ,  260         , 180 ],
       [ "1.4"        , 22         ,  260         , 180 ],
       [ "1.5"        , 30         ,  260         , 180 ],
       [ "1.6"        , 36         ,  260         , 180 ],
       [ "1.7"        , 42         ,  260         , 180 ],
       [ "1.8"        , 48         ,  260         , 180 ],
       [ "1.9"        , 54         ,  260         , 180 ],
       [ "2.0"        , 60         ,  260         , 180 ]
    ]
    var data1 = JSON.parse('[["price","rate"],["0.06","0"],["0.07","0"],["0.08","0"],["0.09","0"],["0.10","0"],["0.11","0"],["0.12","0"],["0.13","0"],["0.14","0"],["0.15","0"],["0.16","0"],["0.17","0"],["0.18","0"],["0.19","0"],["0.20","0"],["0.22","0"],["0.24","0"],["0.26","0"],["0.28","0"],["0.30","0"],["0.33","0"],["0.36","0"],["0.39","0"],["0.42","0"],["0.46","0"],["0.50","0"],["0.55","0"],["0.60","0"],["0.66","0"],["0.72","0"],["0.79","0"],["0.86","0"],["0.94","0"],["1.03","0"],["1.13","0"],["1.24","0"],["1.36","0"],["1.49","0"],["1.63","0"],["1.79","0"],["1.96","0"]]')
    var anchorXIndex = 9                              //瞄准器x轴索引
    /*
    var options = {
        event : {
            enabled : 1,                              //是否开启手型
            on : function(e){
                if(e.eventType == 'click'){
                    //e.iGroup = 第几条线(从1开始)   e.iNode = 第几个节点(从1开始)
                    // console.log(e.iGroup, e.iNode)
                    console.log(data1[e.iNode][0], data1[e.iNode][1])
                }
                console.log(e.eventType, data1[e.iNode][0], data1[e.iNode][1])
            }
        },

        back  : {
            yAxis     :{
                enabled  : 1
            }
        },
        anchor: {                      //瞄准器
            enabled : 1,
            num  : 0,                      //数值
            xIndex: 9,                     //x轴索引
            xAxis : {
                fillStyle : '#cc3300'
            },
            yAxis : {
                fillStyle : '#cc3300' 
            }            
        },
        yAxis : {
            enabled : true,
            text:{
                fillStyle : '#666666'
            },
            //dataSection : [-80,-60,-40,-20,0,20,40,60,80],
            textFormat : function( text ){
                return text + "%"
            },
            field : ["line1"]
        },
        xAxis : {
            // enabled : false,
            // dataSection : [0,0.5,1.0,1.5,2.0],
            text:{
                mode      : 1,
                dis       : 2,
                fillStyle : '#000000'
            },
            field : "date"
        },
        graphs:{

            line:{
                strokeStyle : {
                    normal : ["#1054a3"]
                }
            },
            fill:{
                alpha:0
            },
            node:{
                fillStyle:{
                    normal:function(o){
                        if(o.iNode == anchorXIndex){
                            return '#cc3300'
                        }
                    },
                    over:function(o){
                        if(o.iNode == anchorXIndex){
                            return '#cc3300'
                        }
                    }
                },
                strokeStyle:{
                    normal:function(o){
                        if(o.iNode == anchorXIndex){
                            return '#cc3300'
                        }
                    },
                    over:function(o){
                        if(o.iNode == anchorXIndex){
                            return '#cc3300'
                        }
                    }
                },
                lineWidth:{
                    normal:function(o){
                        if(o.iNode == anchorXIndex){
                            return 4
                        }
                    }
                }
            }
        },
        tips  : {
            line : {
                enabled : 0
            },
            content : function(info){
                var str  = "<table>";
                
                // var color =  (node.color || node.fillStyle)
                var color = info.iNode >= anchorXIndex ? '#cc3300' : '#26b471'
                str += '<tr style="color:' + color +'"><td>' + '出价：' + data1[info.iNode + 1][0] + '元' + '</td></tr>'

                _.each( info.nodesInfoList , function( node , i ){
                    var prefix = '展现量上升：'
                    var value = node.value
                    if(info.iNode >= anchorXIndex){
                    }else{
                        prefix = '展现量下降：'
                        value  = Math.abs(value)
                    }
                    var lastfix = '%'
                    str += "<tr style='color:"+ color +"'>"
                    str +="<td>"+ prefix +"</td>";
                    str += "<td>"+ value + lastfix +"</td></tr>";
                });
                return str;
            }
        }
    }
    */
    var options = {
        "event":{"enabled":1},
         "back":{
            "yAxis":{"enabled":1}
                },
        "anchor":{
            "enabled":1,
            "num":"0.10",
            "xIndex":4,
            "xAxis":{
                "fillStyle":"#cc3300"
                   },
            "yAxis":{
                "fillStyle":"#cc3300"
                    }
                },
        "yAxis":{
            enabled:1,
            "text":{
                "fillStyle":"#666666"
                   },
            "field":["rate"]
                },
        "xAxis":{
            "text":{
                // "mode":1,
                // "dis":5,
                "fillStyle":"#000000"
                   },
            "field":"price"
                },
        "graphs":{
            "line":{
                "strokeStyle":'#1054a3'
                   },
            "fill":{
                "alpha":0
                   },
            "node":{
                "fillStyle":{},
                "strokeStyle":{},
                "lineWidth":{}
                   }
                 },
        "tips":{
            "line":{
                "enabled":1
                   }
               }
        }
    // var options = JSON.parse('{"event":{"enabled":1},"back":{"yAxis":{"enabled":1}},"anchor":{"enabled":1,"num":"0.10","xIndex":4,"xAxis":{"fillStyle":"#cc3300"},"yAxis":{"fillStyle":"#cc3300"}},"yAxis":{"text":{"fillStyle":"#666666"},"field":["rate"]},"xAxis":{"text":{"mode":1,"dis":1,"fillStyle":"#000000"},"field":"price"},"graphs":{"line":{"strokeStyle":{"normal":["#1054a3"]}},"fill":{"alpha":0},"node":{"fillStyle":{},"strokeStyle":{},"lineWidth":{}}},"tips":{"line":{"enabled":1}}}')
    // KISSY.config({
    //     packages: [{
    //         name  :  'chartx'  ,
    //         path  :  '../../',
    //         debug :  true
    //     }
    //     ]
    // });

    KISSY.use("chartx/chart/line/ , node" , function( S , Line ){
        var line = new Line( S.all("#canvasTest") , data1 , options  );
        line.draw();
    });
});
