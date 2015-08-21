define(
    'chartx/chart/original/relcircle/layout',
    [
    ],
    function(  ){
        return function( dataFrame , opts ){
            
            var opt   = {
                w         : 0,
                h         : 0,
                groupSort : null,

                node      : {
                    r     : 25,
                    fillStyle : "#67b1e6"
                },
                edge      : {
                    lineWidth : 6,
                    fillStyle : "#999"
                }
            };

            _.deepExtend( opt , opts );

            //计算好node的pos
            var angStep = Math.PI*2 / dataFrame.nodesLen;

            var rectRange = {
                w : opt.w - opt.node.r*2,
                h : opt.h - opt.node.r*2
            };
            var bigR = Math.min( rectRange.w , rectRange.h )/2;
            //_.each( dataFrame.nodes , function(node , i){
            var i = 0;
            for( var n in dataFrame.nodes ){
                var node = dataFrame.nodes[n];
                node.pos = {
                    x : opt.w / 2 + bigR*Math.cos( i*angStep ),
                    y : opt.h / 2 + bigR*Math.sin( i*angStep )
                };
                node.r = opt.node.r;
                node.fillStyle = opt.node.fillStyle;
                i++;
            } ;

            for( var e in dataFrame.edges ){
                var edge = dataFrame.edges[e];
                edge.value     = edge.value;
                edge.lineWidth = opt.edge.lineWidth;
                edge.fillStyle = opt.edge.fillStyle;
                edge.from = dataFrame.nodes[ e.split(/[_-]/)[0] ];
                edge.to   = dataFrame.nodes[ e.split(/[_-]/)[1] ];
            }
            return dataFrame;
        }
    }
)
