KISSY.ready(function () {
  var S = KISSY;
  var data1 = [   
        //['Opera1', 0.1],               
        ['Firefox', 20],
        ['Opera2', 1],
        ['Opera2', 1],
        ['Opera3', 1],
        ['Opera4', 1],
        ['Opera5', 1],
        ['Opera2', 1],
        ['Opera2', 1],
        ['Opera3', 1],
        ['Opera4', 1],
        ['Opera5', 1],
        ['Firefox', 20],        
        ['Firefox', 20],
        ['Opera2', 1],
        ['Opera2', 1],
        ['Opera3', 1],
        ['Opera4', 1],
        ['Opera5', 1],
        ['Opera2', 1],
        ['Opera2', 1],
        ['Opera3', 1],
        ['Opera4', 1],
        ['Opera5', 1],
        ['Firefox', 20]                         
    ];
  var options = {
    //浮动tip
    tip: {
      enabled: true,
      format: '{point.title}\n{point.percentage}'
    },
    //周边tip
    dataLabel: {
      enabled: true,
      format: '{point.name} : {point.percentage}'
    },
    //是否允许扇形选取
    allowPointSelect: true,
    cursor: 'pointer',
    //是否允许动画
    animation: true,
    //内圆半径
    innerRadius: 40,
    strokeWidth:2,
    //颜色序列,若不设置，会有默认的颜色序列
    //colors:['red', 'yellow', 'blue']
  }

  KISSY.use("dvix/chart/pie/ , node", function (S, Pie) {
    window.pie = new Pie(S.all("#canvasTest"));
    pie.draw(data1, options);
  });
});
