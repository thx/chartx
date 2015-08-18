define(
    'chartx/chart/original/relcontrast/layout',
    [
    ],
    function(  ){
        return function( dataFrame , opts ){
            
            var opt   = {
                w         : 0,
                h         : 0,
                groupSort : null,

                node      : {
                    maxR  : 36,
                    minR  : 8
                },
                edge      : {
                    maxLineWidth : 8,
                    minLineWidth : 1
                }
            };
            _.deepExtend( opt , opts );

            var maxR  = 0; //最大园半径,等于h / dataFrame.group的最大length
            var maxVal= 0;
            var maxGL = 0; //dataFrame.group的最大分组的length
            for( var g in dataFrame.group ){
                maxGL = Math.max( maxGL , dataFrame.group[g].length );
            };
            maxR = Math.min(opt.h , opt.w) / maxGL / 2 - 3;
            maxR = Math.min( maxR , opt.node.maxR );
            
            //先给dataFrame.nodes 每个节点添加 r , pos 属性
            _.each( dataFrame.nodes , function( node ){
                node.r = parseInt( Math.max(node.value / dataFrame.max * maxR , opt.node.minR ));
            } );

            //然后根据分组，计算两组node的pos位置信息
            //第一组在left，第二组在right
            if( !opt.groupSort ){
                opt.groupSort = _.keys( dataFrame.group );
            };

            //两group围绕的圆心pos
            var orgPos = { x: opt.w/2 , y: opt.h/2};
            var orgRect= { w: Math.min(opt.w,opt.h) - maxR*2 , h: Math.min(opt.w,opt.h) - maxR*2 };

            _.each( opt.groupSort , function( g , i ){
                var angRange = [];
                var group = dataFrame.group[g];

                if( i == 0 ){
                    angRange = [ Math.PI - 90*Math.PI/180 , Math.PI + 90*Math.PI/180 ]
                } else {
                    angRange = [ -90*Math.PI/180 , 90*Math.PI/180 ]
                };
                var gLen     = group.length + 1;
                var angStep  = Math.abs( angRange[0] - angRange[1] ) / gLen;

                var R        = orgRect.h/2 / Math.abs(Math.sin(angRange[0]));
                
                _.each( group , function( node , ii ){
                    var ang  = angRange[0]+angStep*(ii+1);
                    node.pos = {
                        x : parseInt(orgPos.x + Math.cos( ang ) * R),
                        y : parseInt(orgPos.y + ( i==0 ? -1 : 1) * Math.sin( ang ) * R)
                    };
                    node.fillStyle = opt.group.fillStyle[i];
                    node.direction = (i==0?"left":"right")
                } );
            } );

            //计算edge的lineWidth
            for( var e in dataFrame.edges ){
                var edge = dataFrame.edges[e];
                edge.lineWidth = Math.max( edge.value / dataFrame.maxEdge * opt.edge.maxLineWidth , opt.edge.minLineWidth );
            }
            return dataFrame;
        }
    }
)
