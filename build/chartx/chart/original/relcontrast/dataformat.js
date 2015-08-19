define(
    'chartx/chart/original/relcontrast/dataformat',
    [
    ],
    function( ){
        return function( data , opt ){
            var dataFrame = {
                max     : 0,
                maxEdge : 0,
                org     : data,
                nodes   : {},
                group   : {},
                edges   : {} 
            };
            var titles = data.shift();
            var arr = [];
            _.each( data , function( row , i ){
                var rowObj = {};
                _.each(titles , (function(t,ii){
                    rowObj[t] = row[ii];
                }));
                arr.push( rowObj );
                dataFrame.max = Math.max( dataFrame.max , rowObj.value );
                dataFrame.nodes[ rowObj.node ] = rowObj;
            } );
    
            dataFrame.group = _.groupBy( arr , function(o){
                return o.group
            } );

            var edges = {};
            for( var n in dataFrame.nodes ){
                var node = dataFrame.nodes[n];
                _.each( node.link , function( l , i ){
                    var edge = {
                        value : l,
                        conversely : i+"_"+n,
                        from  : dataFrame.nodes[n],
                        to    : dataFrame.nodes[i]
                    }
                    edges[ n+"_"+i ] = edge;
                } );
            };
            //然后找到a_c  c_a 这样的做merge

            for( var e in edges ){
                var co = edges[e];
                delete edges[e];
                if( edges[co.conversely] ){
                   //如果有存在对应的edge,说明这两个是一条线。需要merge
                   var conversely = edges[co.conversely];
                   delete edges[co.conversely];
                   if( conversely.value > co.value ){
                        conversely.value += co.value
                        dataFrame.edges[ co.conversely ] = conversely;
                        dataFrame.maxEdge  = Math.max(dataFrame.maxEdge , conversely.value);
                   } else {
                        co.value += conversely.value;
                        dataFrame.edges[ e ] = co;
                        dataFrame.maxEdge  = Math.max(dataFrame.maxEdge , co.value);
                   }
                } else {
                   dataFrame.edges[e] = co;
                   dataFrame.maxEdge  = Math.max(dataFrame.maxEdge , co.value);
                }
            };

            return dataFrame;
        }
    }
);

