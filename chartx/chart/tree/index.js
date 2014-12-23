define(
    "chartx/chart/tree/index",
    [ 
        "chartx/chart/index",
        "canvax/shape/Rect",
        "canvax/shape/Line",
        "canvax/shape/Circle",
        "chartx/layout/tree/dagre" 
    ],
    function( Chart , Rect , Line , Circle , Dagre ){
        var Canvax = Chart.Canvax;
        return Chart.extend({
            init : function( node , data , opts ){
                _.deepExtend( this , opts );
            },
            draw : function(){
                this._widget();
            },
            _widget : function(){
                var me = this;
                var g = new Dagre.graphlib.Graph();

                g.setGraph({
                    //rankdir : "BT"
                });

                g.setDefaultEdgeLabel(function() { return {}; });

                g.setNode("kbacon",     { label: "皇帝",   width: 121, height: 100 });

                g.setNode("kspacey",    { label: "小吏",  width: 144, height: 100 });
                g.setNode("swilliams",  { label: "丞相", width: 160, height: 100 });
                g.setNode("bpitt",      { label: "大内总管",     width: 108, height: 100 });
                g.setNode("hford",      { label: "小兵", width: 168, height: 100 });
                g.setNode("lwilson",    { label: "将军",   width: 144, height: 100 });
                
                // Add edges to the graph.
                /*
                g.setEdge("kspacey",   "swilliams");
                g.setEdge("swilliams", "kbacon");
                g.setEdge("bpitt",     "kbacon");
                g.setEdge("hford",     "lwilson");
                g.setEdge("lwilson",   "kbacon");
                */

                
                // Add edges to the graph.
                g.setEdge( "kbacon" , "swilliams");
                g.setEdge( "kbacon" , "bpitt");
                g.setEdge( "kbacon" , "lwilson");

                g.setEdge( "swilliams","kspacey");
                g.setEdge( "lwilson"  , "hford");


                Dagre.layout(g);


                g.nodes().forEach(function(v) {
                    //console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
                    var node = g.node(v);
                    me.stage.addChild( new Rect({
                        context : {
                            x : node.x - node.width/2,
                            y : node.y - node.height/2,
                            fillStyle : "red",
                            width : node.width,
                            height: node.height
                        }
                    }) );
                    me.stage.addChild( new Canvax.Display.Text( node.label , {
                        context : {
                            x : node.x,
                            y : node.y,
                            fillStyle    : "white",
                            textAlign    : "center",
                            textBaseline : "middle"
                        }
                    }));
                });
                g.edges().forEach(function(e) {
                    var edge = g.edge(e);
                    //console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
                    var colors = ["#6f8cb2" , "#c77029" , "blue"];
                    _.each( edge.points , function( item , i ){
                        me.stage.addChild( new Circle({
                            context : {
                                x : item.x,
                                y : item.y,
                                fillStyle : colors[i],
                                r : 6
                            }
                        }) );
                    } );
                   
                });


            }
        });
    }
);
