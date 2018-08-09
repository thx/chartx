define(
    'chartx/chart/original/flowinout/layout',
    [
    ],
    function(  ){
        function flowoutLayout( group , sourceNode , opt , dataFrame ){

            //给edges设置好path
            var prePathBottom = 0;
            _.each( group , function( node , en ){
                var edge       = dataFrame.edges[ sourceNode.node + "_" + node.node ];
                var fromNode   = sourceNode;
                var targetNode = node;
                var pathY = fromNode.pos.y + prePathBottom;
                var pathX = fromNode.pos.x + fromNode.w-2;

                var pathX,pathY,qc;

                if( !edge ){
                    edge       = dataFrame.edges[ node.node + "_" + sourceNode.node ];
                    pathX      = fromNode.pos.x;
                    path = "M"+pathX+"," + pathY;
                    qc = {
                        x : pathX - ( pathX - targetNode.pos.x - targetNode.w )/2,
                        y : pathY
                    };
                    path+= "C"+ qc.x +","+qc.y+","+qc.x+","+targetNode.pos.y+","+(targetNode.pos.x+targetNode.w-1)+","+targetNode.pos.y;
                    path+= "v"+targetNode.h;
                    
                    path+= "C"+qc.x+","+(targetNode.pos.y+targetNode.h)+","+qc.x+","+(pathY+targetNode.h)+","+pathX+","+(pathY+targetNode.h);

                    edge.path = path;
                    prePathBottom += targetNode.h;


                } else {
                    path = "M"+pathX+"," + pathY;
                    qc = {
                        x : ( edge.to.pos.x - pathX )/2 + pathX,
                        y : pathY
                    };
                    path+= "C"+ qc.x +","+qc.y+","+qc.x+","+targetNode.pos.y+","+(targetNode.pos.x+1)+","+targetNode.pos.y;
                    path+= "v"+targetNode.h;
                    
                    path+= "C"+qc.x+","+(targetNode.pos.y+targetNode.h)+","+qc.x+","+(pathY+targetNode.h)+","+pathX+","+(pathY+targetNode.h);

                    edge.path = path;
                    prePathBottom += targetNode.h;

                };

            } );
        };

        function _getFillStyle( fillStyle , node ){
            if(_.isFunction( fillStyle )){
                return fillStyle(node)
            } else {
                fillStyle;
            }
        };

        return function( dataFrame , opts ){
        
            var opt   = {
                w         : 0,
                h         : 0,
                node      : {
                    w     : 0,
                    maxW  : 150,
                    h     : 0,
                    maxH  : 0,
                    minH  : 20,
                    marginTop : 20,
                    fillStyle : "#60ADE4"
                },
                edge      : {
                
                },
                group : {
                    left   : {},
                    middle : {},
                    right  : {}
                }
            };

            _.deepExtend( opt , opts );

            //计算好node的w , h
            if( !opt.node.w ){
                opt.node.w = Math.min(opt.w / 5 , opt.node.maxW);
            };
            
            var middle =  dataFrame.group.middle;
            //计算中间node的高度
            middle.h = opt.h - opt.node.marginTop*dataFrame.maxLinks;
            middle.w = opt.node.w;
            middle.pos = {
                y : opt.node.marginTop,
                x : opt.w / 5 * 2
            };
            middle.fillStyle = _getFillStyle(opt.node.fillStyle , middle);

            //计算left的每个node的w h 和pos
            var preBottom  = 0;//上一个node的底部
            var leftCountH = 0;
            _.each( dataFrame.group.left , function( node , n ){
                node.w = opt.node.w;
                node.h = node.value / middle.value * middle.h;
                leftCountH += node.h;
                node.pos = {
                    x : 0,
                    y : preBottom + opt.node.marginTop
                };
                node.fillStyle = _getFillStyle(opt.node.fillStyle , node);
                preBottom += (node.h+opt.node.marginTop);
            } );

            middle.h = Math.max( leftCountH , middle.h );

            //计算right的每个node的w h 和pos
            var preBottom = 0;//上一个node的底部
            _.each( dataFrame.group.right , function( node , n ){
                node.w = opt.node.w;
                node.h = node.value / middle.value * middle.h;
                node.pos = {
                    x : opt.w / 5 * 4,
                    y : preBottom + opt.node.marginTop
                };
                node.fillStyle = _getFillStyle(opt.node.fillStyle , node);
                preBottom += (node.h+opt.node.marginTop);
            } );

            flowoutLayout( dataFrame.group.left  , middle , opt , dataFrame );
            flowoutLayout( dataFrame.group.right , middle , opt , dataFrame );
            return dataFrame;
        }
    }
);

