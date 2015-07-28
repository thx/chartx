define(
    "chartx/chart/funnel/graphs",
    [
        "canvax/index",
        "canvax/shape/Polygon",
        "canvax/animation/Tween",
        "chartx/utils/tools"
    ],
    function(Canvax , Polygon , Tween , Tools ){
 
        var Graphs = function(opt){

            this.w = 0;
            this.h = 0;

            this.data = [
                {
                   pointList   : [[24,5], [550,5], [487,49], [87,49]],
                   fillStyle   : '#B6A2DF',
                   strokeStyle : '#B6A2DF',
                   lineWidth   : 1
                },

                {
                    pointList  : [[90,61],[480,61],[420,101],[153,101]],
                    fillStyle  : '#59bef0',
                    strokeStyle: '#59bef0',
                    lineWidth  : 1 
                }
            ]

            this.back = {
                pointList    : [[0,0],[500,0],[250,280]],
                strokeStyle  : '#cccccc',
                lineWidth    : 1
            };

            this.eventEnabled = true;
    
            this.sprite = null ;
    
            _.deepExtend(this , opt);

            this.init();
        };
    
        Graphs.prototype = {
            init : function(){
                this.sprite = new Canvax.Display.Sprite({ id : "graphsEl" });
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            draw : function(data , opt){
                var me    = this;
                _.deepExtend(this , opt);
    
                var back = new Polygon({         //背景
                    id : "back",
                    context : this.back
                })


                _.each(me.data, function(data, i){
                    var polygon = new Polygon({
                        id : 'polygon_' + i,
                        context : data
                    })
                    me.sprite.addChild(polygon)
                });

                me.sprite.addChild(back)

                me.sprite.context.x = me.pos.x;
                me.sprite.context.y = me.pos.y;
            },
            /**
             * 生长动画
             */
            grow : function(){

            },
            _growEnd : function(){

            },
            _getInfoHandler:function( target ){

            },
            _getNodeInfo : function(){
               
            },
            _fireHandler:function(e){
                // e.params  = {
                //     iGroup : e.tipsInfo.iGroup,
                //     iNode  : e.tipsInfo.iNode,
                //     iLay   : e.tipsInfo.iLay
                // }
                // this.root.fire( e.type , e );
            }
        }; 
    
        return Graphs;
    } 
)
