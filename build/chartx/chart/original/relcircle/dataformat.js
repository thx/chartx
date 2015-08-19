define(
    'chartx/chart/original/relcircle/dataformat',
    [
    ],
    function( ){
        return function( data , opt ){
            var dataFrame = {
                org     : data,
                nodesLen: 0,
                nodes   : {},
                edges   : {} 
            };
            var titles = data.shift();
            _.each( data , function( row , i ){
                var rowObj = {};
                _.each(titles , (function(t,ii){
                    rowObj[t] = row[ii];
                }));
                dataFrame.edges[ rowObj.edge ] = rowObj;
            } );

            //计算node信息
            var currNodes = [];
            _.each(_.keys( dataFrame.edges ) , function( edge ){
                _.each( edge.split(/[_-]/) , function( n ){
                    currNodes.push(n);
                });
            });
            currNodes = _.uniq(currNodes);
            _.each( currNodes , function( n ){
                dataFrame.nodesLen ++;
                dataFrame.nodes[ n ] = {
                    node : n,
                    link : getLinks( n )
                }
            } );

            function getLinks(n){
                var links = {};
                _.each( dataFrame.edges , function( edge ){
                    if( edge.edge.indexOf(n) >= 0 ){
                        links[edge.edge] = edge;
                    }
                } );
                return links;
            }
            return dataFrame;
        }
    }
);

