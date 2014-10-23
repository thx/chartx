KISSY.ready(function () {
    var S = KISSY;
    var data1 = [
            [
                'Firefox',
                45
            ],
            [
                'IE',
                26.8
            ],
            {
                name: 'Chrome',
                y: 12.8,
                selected: true
            },
            [
                'Safari',
                8.5
            ],
            [
                'Opera',
                6.2
            ],
            [
                'Others',
                0.7
            ]
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
        };
    //颜色序列,若不设置，会有默认的颜色序列
    //colors:['red', 'yellow', 'blue']
    KISSY.use('dvix/chart/pie/ , node', function (S, Pie) {
        window.pie = new Pie(S.all('#canvasTest'));
        pie.draw(data1, options);
    });
});