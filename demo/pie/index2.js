//Demo with requirejs, jquery
requirejs.config({
  paths: {
    'jquery-1.11.1':'../../lib/jquery-1.11.1.min',
    'domReady': '../../lib/domReady'
  }
});

requirejs(['domReady', '../../lib/underscore', 'dvix/chart/pie/index', 'jquery-1.11.1'], function (domready, underscore, Pie, $) {
  domready(function () {
    var data1 = [
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
      strokeWidth: 2
      //颜色序列,若不设置，会有默认的颜色序列
      //colors:['red', 'yellow', 'blue']
    }

    window.pie = new Pie(Dvix.getEl("canvasTest"), data1, options);
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
      var legendContainer = $("#pieLegend");
      legendContainer.empty();
      ul = $('<ul></ul>');
      legendContainer.append(ul);

      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        li = $('<li id="list_' + item.index + '" index="' + item.index + '" style="color:' + item.color + '"><span style="background-color:' + item.color + '"></span>' + item.name + '</li>');
        ul.append(li);
      }

      //使用show方法控制扇形的显示与隐藏
      $('li', legendContainer).on('click', function (e) {
        var index = e.target.getAttribute('index');
        pie.show(index);
      });
    });
    pie.draw();
  })  
})