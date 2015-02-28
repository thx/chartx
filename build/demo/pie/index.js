KISSY.ready(function () {
    var S = KISSY;
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
        /*
        tip: {
            enabled: true,
            format: '{point.title}\n{point.percentage}'
        },
        */
        tips : {
            //enabled  : false,
            content : function(info){
                return "xxx"

            }
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

    KISSY.use("chartx/chart/pie/ , node", function (S, Pie) {
        window.pie = new Pie(S.all("#canvasTest"), data1, options);
        pie.on('focused', function (e) {

        })
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

            //使用show方法控制扇形的显示与隐藏
            legendContainer.all('li').on('click', function (e) {
                var index = e.target.getAttribute('index');
                pie.show(index);
            });
        });

        pie.draw();
    });
});
