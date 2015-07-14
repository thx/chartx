define(
        "chartx/chart/force/index",
        [
            'chartx/chart/index',
            'canvax/shape/Line',
            'canvax/shape/Circle',
            'chartx/layout/force/physics/system'
        ],
        function( Chart , Line , Circle , ParticleSystem ){
            var Canvax = Chart.Canvax;
            return Chart.extend({
                data : null,
                init : function( node , data , opt ){
                    this.data = data;

                    this.edgeStyle = "rgba(110,139,180,0.3)";//"#6e8bb4";
                    this.nodeStyle = "#c9701c";

                    this.particleSystem = null;
                    this.spriteEdge = new Canvax.Display.Sprite({
                        id      : 'spriteEdge'
                    });;
                    this.spriteNode = new Canvax.Display.Sprite({
                        id      : 'spriteNode'
                    });

                    this.stage.addChild( this.spriteEdge );
                    this.stage.addChild( this.spriteNode );
                },
                draw : function(){
                    this._widget();
                    this.drawed = true;
                },
                _simpleRenderer : function(canvas){
                    
                    var me = this;
                    var that = {
                        init:function(system){
                            me.particleSystem = system;
                            me.particleSystem.screenSize(me.width, me.height); 
                            me.particleSystem.screenPadding(80); 
                        },
                        redraw:function(){
                            me.particleSystem.eachEdge(function(edge, pt1, pt2){
                                var line = me.spriteEdge.getChildById( "edge"+edge._id );
                                if( line ){
                                    line.context.xStart = pt1.x;
                                    line.context.yStart = pt1.y;
                                    line.context.xEnd   = pt2.x;
                                    line.context.yEnd   = pt2.y;
                                    line.context.lineWidth = 4*edge.data.weight;
                                } else {
                                    me.spriteEdge.addChild(new Line({
                                        id : "edge"+edge._id,
                                        context : {
                                            xStart : pt1.x,
                                            yStart : pt1.y,
                                            xEnd   : pt2.x,
                                            yEnd   : pt2.y,
                                            lineWidth : 4*edge.data.weight,
                                            strokeStyle : me.edgeStyle//"rgba(255,255,255, .333)"
                                        }
                                    }));
                                }
                            });
                            

                            me.particleSystem.eachNode(function(node, pt){
                                // node: {mass:#, p:{x,y}, name:"", data:{}}
                                // pt:   {x:#, y:#}  node position in screen coords
                                var circle = me.spriteNode.getChildById("node"+node._id);
                                if( circle ){
                                    circle.context.x = pt.x;
                                    circle.context.y = pt.y;
                                } else {
                                    me.spriteNode.addChild(new Circle({
                                        id : "node"+node._id,
                                        context : {
                                            x : pt.x,
                                            y : pt.y,
                                            r : 6,
                                            fillStyle : me.nodeStyle
                                        }
                                    }));
                                }

                            });   			
                        }
                    };
                    return that
                },
                _widget : function(){
                    var sys = ParticleSystem(1000, 800, 10);
                    sys.parameters({
                        stiffness:900, 
                        repulsion:2000, 
                        gravity:true, 
                        dt:0.015 ,
                        //precision:0.6
                    });
                    sys.renderer = this._simpleRenderer("viewport");
                    sys.graft({nodes:this.data.nodes, edges:this.data.edges});
                }
            });
        }
);
