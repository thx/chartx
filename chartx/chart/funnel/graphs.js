define(
    "chartx/chart/funnel/graphs",
    [
        "canvax/index",
        "canvax/shape/Polygon",
        "canvax/animation/Tween",
        "chartx/utils/tools",
        "chartx/chart/theme",
        'chartx/utils/gradient-color',
    ],
    function(Canvax , Polygon , Tween , Tools, Theme, GradientColor){
 
        var Graphs = function(opt){

            this.colors = Theme.colors

            this.text = {
                fontSize : 12,
                fillStyle:'#ffffff'
            }   

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
                var me  = this;
                me.data = data

                _.deepExtend(this , opt);
                
                var colors = me.colors
                if(!_.isArray(colors)){
                    var colors = new GradientColor(colors.first, colors.last, me.data.length)
                    colors.push(colors.end)
                }

                _.each(me.data, function(data, i){
                    var sprite = new Canvax.Display.Sprite({ id : i });
                    me.sprite.addChild(sprite)

                    //画多边形
                    data.polygon.fillStyle = colors[i]

                    var polygon = new Polygon({
                        id : i,
                        context : data.polygon
                    })
                    polygon.iNode = i
                    polygon.hoverClone = false
                    sprite.addChild(polygon)

                    polygon.on("panstart mouseover", function(e){
                        e.eventInfo = me._getInfoHandler(e);
                        this.context.globalAlpha = 0.7;
                        // this.parent.getChildAt(1).context.fontSize = 20
                    });
                    polygon.on("panmove mousemove", function(e){
                        e.eventInfo = me._getInfoHandler(e);
                    });
                    polygon.on("panend mouseout", function(e){
                        e.eventInfo = {};
                        this.context.globalAlpha = 1
                    });

                    //写文字
                    data.text.y -= me.text.fontSize / 2 + 2
                    data.text.textAlign = 'center'
                    data.text.fontSize = me.text.fontSize
                    data.text.fillStyle = me.text.fillStyle
                    var text = new Canvax.Display.Text(data.text.label, {
                        context: data.text
                    });
                    sprite.addChild(text)
                });


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
            _getInfoHandler:function( e ){
                var target = e.target;
                return {
                    iNode         : target.iNode,
                    nodesInfoList : []
                };
            },
            _getNodeInfo : function(){
               
            },
            _fireHandler:function(e){
            }
        }; 
    
        return Graphs;
    } 
)
