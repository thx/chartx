KISSY.ready(function () {
    var S = KISSY;
    window.data1 = [
        [
            'val1',
            'val2',
            'val3'
        ],
        [
            'Eating',
            65,
            28
        ],
        [
            'Drinking',
            59,
            48
        ],
        [
            'Sleeping',
            90,
            40
        ],
        [
            'Designing',
            81,
            19
        ],
        [
            'Coding',
            56,
            96
        ],
        [
            'Cycling',
            55,
            27
        ],
        [
            'Running',
            40,
            100
        ]
    ];
    window.options = {
        // title : "first charts",
        // disXAxisLine : 26,
        // disYAxisTopLine : 26,
        //rotate   : -90,
        disYAndO: 20,
        //r     : 200,
        mode: 1,
        //模式( 1 = 正常(y轴在背景左侧) | 2 = 叠加(y轴叠加在背景上))[默认：1]
        yAxis: {
            field: [
                'val2',
                'val3'
            ]
        },
        xAxis: { field: ['val1'] },
        back: {},
        //r : 150 //蜘蛛网的半径，决定了整个图的大小默认为chart的min(width,height)
        graphs: {}
    };
    KISSY.use('dvix/chart/radar/ , node', function (S, Radar) {
        window.radar = new Radar(S.all('#canvasTest'), data1, options);    //radar.draw();
    });
});