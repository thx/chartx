define(
    'chartx/chart/original/flowall/layout',
    [
    ],
    function(  ){
        function flowoutLayout( dataFrame , sourceNode , opt ){
            sourceNode.pos = {
                x : (opt.w/3 - sourceNode.w) / 2,
                y : opt.node.marginTop
            };
            var preBottom= opt.node.marginTop;
            _.each( dataFrame.nodes , function( node , name ){
                if( node !== sourceNode ){
                    node.pos = {
                        x : (opt.w/3 - sourceNode.w) / 2 + opt.w*2/3,
                        y : preBottom
                    }
                    preBottom += opt.node.marginTop + node.h;
                }
            } );

            //给edges设置好path
            var prePathBottom = 0;
            _.each( dataFrame.edges , function( edge , en ){
                var pathY = edge.from.pos.y+prePathBottom;
                var pathX = edge.from.pos.x+edge.from.w-2;
                
                var path = "M"+pathX+"," + pathY;
                    var qc = {
                        x : ( edge.to.pos.x - pathX )/2 + pathX,
                        y : pathY
                    }
                    path+= "C"+ qc.x +","+qc.y+","+qc.x+","+edge.to.pos.y+","+(edge.to.pos.x+1)+","+edge.to.pos.y;
                    
                    path+= "v"+edge.to.flowinH;
                    //path+= "C"+qc.x+","+(qc.y+edge.to.flowinH)+","+qc.x+","+(pathY+edge.to.flowinH)+","+pathX+","+(pathY+edge.to.flowinH);
                    
                    path+= "C"+qc.x+","+(edge.to.pos.y+edge.to.flowinH)+","+qc.x+","+(pathY+edge.to.flowinH)+","+pathX+","+(pathY+edge.to.flowinH);
                    //path+= "C"+qc.x+","+

                edge.path = path;
                prePathBottom += edge.to.flowinH;
            } );
        };
        function _getFillStyle( fillStyle , node ){
            var fs
            if(_.isFunction( fillStyle )){
                fs = fillStyle(node)
            }
            if( !fs ){
                return "#60ADE4"
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
                    minH  : 2,
                    marginTop : 20,
                    fillStyle : "#60ADE4"
                },
                edge      : {
                }
            };

            _.deepExtend( opt , opts );
            

            //计算好node的w , h
            if( !opt.node.w ){
                opt.node.w = Math.min(opt.w / 3 , opt.node.maxW);
            };
            

            var maxVal   = 0;
            var maxGroupLen = 0;
            
            if( dataFrame.maxLinks > 1 ){
                //flowout布局
                //先计算出最大的value
                maxGroupLen = dataFrame.maxLinks;
                if( !opt.node.maxH ){
                    opt.node.maxH = opt.h / maxGroupLen - opt.node.marginTop;
                };
                var sourceNode;
                _.each( dataFrame.nodes , function( node , name ){
                    node.w = opt.node.w;
                    if( !node.link ){
                        maxVal   = Math.max( maxVal , node.value );
                    } else {
                        sourceNode = node;
                    };
                    node.fillStyle = _getFillStyle(opt.node.fillStyle , node);
                });
                _.each( dataFrame.nodes , function( node , name ){
                    if( !node.link ){
                        node.h = ( opt.node.h || ( node.value/maxVal * opt.node.maxH ) );
                        node.h = Math.max( opt.node.minH , node.h );
                        node.flowinH = Math.max(node.flowin / node.value * node.h , 1 );
                        
                        
                        if( !sourceNode.h ){
                            sourceNode.h = node.flowinH
                        } else {
                            sourceNode.h += node.flowinH
                        }
                    }
                });
                flowoutLayout(dataFrame , sourceNode , opt);
            } else {
                //flowin布局
                _.each( dataFrame.nodes , function( node , name ){
                    if( node.link ){
                        //又link的在左边
                        maxGroupLen ++;
                        maxVal   = Math.max( maxVal , node.value );
                    }
                });
                if( !opt.node.maxH ){
                    opt.node.maxH = opt.h / maxGroupLen - opt.node.marginTop;
                };

            }


            return dataFrame;
        }
    }
);

