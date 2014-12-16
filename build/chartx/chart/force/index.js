define(
        "chartx/chart/force/index",
        [
            'chartx/chart/index',
            'chartx/layout/force/physics/system'
        ],
        function( Chart , ParticleSystem ){
            return Chart.extend({
                data : null,
                init : function( node , data , opt ){
                    this.data = data;
                },
                draw : function(){
                    this._widget();
                },
                _simpleRenderer : function(canvas){
                    var canvas = document.getElementById(canvas)
                var ctx = canvas.getContext("2d");
    var particleSystem = null

    var that = {
      init:function(system){
        particleSystem = system
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
      },
      redraw:function(){
          
        ctx.clearRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
       
          ctx.strokeStyle = "rgba(255,255,255, .333)"
          ctx.lineWidth = 1 + 4*edge.data.weight
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        })

        particleSystem.eachNode(function(node, pt){
         
          var w = 10
          ctx.fillStyle = "white"
          ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)
        })    			
      }
    }
    return that
                    /*
                    var particleSystem = null;
                    var that = {
                        init:function(system){
                            particleSystem = system;
                        },
                        redraw:function(){

                            particleSystem.eachEdge(function(edge, pt1, pt2){

                            });

                            particleSystem.eachNode(function(node, pt){
                            // node: {mass:#, p:{x,y}, name:"", data:{}}
                            // pt:   {x:#, y:#}  node position in screen coords

                            // draw a rectangle centered at pt

                            });   			
                        }
                    };
                    return that
                    */




                  
                },
                _widget : function(){
                    var sys = ParticleSystem(1000, 800, 10);
                    sys.parameters({stiffness:900, repulsion:2000, gravity:true, dt:0.015});
                    sys.renderer = this._simpleRenderer("viewport");
                    sys.graft({nodes:this.data.nodes, edges:this.data.edges});
                }
            });
        }
);
