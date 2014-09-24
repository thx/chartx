KISSY.ready(function(){
    var S = KISSY;
    var data1= [
        ['Firefox',   45.0],
        ['IE',       26.8],
        {
            name: 'Chrome',
            y: 12.8,
            sliced: true,
            selected: true
        },
        ['Safari',    8.5],
        ['Opera',     6.2],
        ['Others',   0.7]
    ];
    var options = {
        title: {
            text: 'Browser market shares at a specific website, 2014'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        mode  : 1,
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: 'black'
          }
        },
        //colors:['red', 'green']
    }
     
    KISSY.config({
        packages: [{
            name  :  'dvix'  ,
            path  :  '../../',
            debug :  true
        }
        ]
    });

        KISSY.use("dvix/chart/pie/ , node", function (S, Pie) {
        debugger
        window.pie = new Pie( S.all("#canvasTest") );
        pie.draw(data1, options);
    });
});
