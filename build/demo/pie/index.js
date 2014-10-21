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
            sliced: true,
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
        tip: {
            enabled: true,
            format: '{point.title}\n{point.percentage}'
        },
        dataLabel: {
            enabled: true,
            format: '{point.name} : {point.percentage}'
        },
        allowPointSelect: true,
        cursor: 'pointer'    //colors:['red', 'yellow', 'blue']
    };
    //colors:['red', 'yellow', 'blue']
    KISSY.config({
        packages: [{
                name: 'dvix',
                path: '../../',
                debug: true
            }]
    });
    KISSY.use('dvix/chart/pie/ , node', function (S, Pie) {
        window.pie = new Pie(S.all('#canvasTest'));
        pie.draw(data1, options);
    });
});