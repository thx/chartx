KISSY.ready(function () {
  KISSY.use("node" , function(){
  
  var S = KISSY;
  var data1 = [
        ['Opera', 1],
        {
            name: 'AAA',
            y: 12.8,
            selected: false
        },
        ['IE', 0],
        ['Safari', 0],
        ['Chrome', 0],
        ['Firefox', 1],
        ['Chrome', 0],
        ['Chrome', 1],
        ['Chrome', 0]        
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
      format: '{point.name} : {point.txt}'
    },
    //是否允许扇形选取
    allowPointSelect: true,
    cursor: 'pointer',
    //是否允许动画
    animation: true,
    //内圆半径
    innerRadius: 80,
    strokeWidth: 2
    //颜色序列,若不设置，会有默认的颜色序列
    //colors:['red', 'yellow', 'blue']
  }

  Chartx.create.pie("canvasTest" , data1 , options).then(function( pie ){
      pie.on('complete', function () {
      //使用getList方法获取圆基础信息
      /*
      {
      name:名称
      index:索引
      r:半径
      color:颜色
      percentage:百分比
      }
      */
      var list = pie.getList();
      var ul, li;
      var legendContainer = S.all("#pieLegend");
      legendContainer.empty();

      ul = S.all('<ul></ul>');
      legendContainer.append(ul);

      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        li = S.all('<li id="list_' + item.index + '" index="' + item.index + '" style="color:' + item.color + '"><span style="background-color:' + item.color + '"></span>' + item.name + '</li>');
        ul.append(li);
      }

      //使用slice方法控制扇形分合
      legendContainer.all('li').on('click', function (e) {
        var index = e.target.getAttribute('index');        
        pie.slice(index);
      });
    })
      pie.draw();
  });

   });

 });
