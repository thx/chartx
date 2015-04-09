KISSY.ready(function(){

    var S = KISSY;

var data = JSON.parse('[["日期","消耗"],["2015-03-20",9.39],["2011",8.95],["2015-03-22",8.13],["2015-03-23",9.56],["2015-03-24",8.87],["2015-03-25",8.32],["2015-03-26",8.33],["2015-03-20",9.39],["2011",8.95],["2015-03-22",8.13],["2015-03-23",9.56],["2015-03-24",8.87],["2015-03-25",8.32],["2015-03-26",8.33]]');
    var options = {
        back  : {
            yAxis     :{
                enabled  : 1
            }
        },
        yAxis : {
            field : "消耗" 
        },
        xAxis : {
            text:{
                rotation  : 30, 
            },
            field : "日期"
        }
    }
    Chartx.create.line("canvasTest" , data , options).then(function( line ){
        window.line = line;
        line.draw();
    })
});
