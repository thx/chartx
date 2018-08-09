define(
    "chartx/chart/original/sector/graphs",
    [
        "canvax/index",
        "canvax/shape/Sector",
        "canvax/animation/Tween",
        "chartx/utils/tools"
    ],
    function(Canvax, Sector, Tween , Tools ){
 
        var Graphs = function(opt,domRoot){

            this.domRoot = domRoot;
            this.w    = 0;
            this.h    = 0;
            this.maxR = 0                                  //最大半径

            this.data = []                                 //实际数据集合

            this.sprite = null ;
    
            _.deepExtend(this , opt);

            this.init();
        };
    
        Graphs.prototype = {
            init : function(opt){
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({ id : "graphsEl" });
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            draw : function(opt){
                var me    = this;
                _.deepExtend(me , opt);

                me.org = me.data

                me.sprite.context.x = me.pos.x
                me.sprite.context.y = me.pos.y

                // var data = [
                //     {
                //         r : 200,
                //         startAngle : -90,
                //         endAngle   : 0
                       
                //     }
                // ]

                var item = new Canvax.Display.Sprite({ id : 'item_' + 1});
                me.sprite.addChild(item)
                me._add({
                    data   : me.data,
                    sprite : item
                })
            },

            _count:function($o){                           //换算单个比例到实际对象
            },

            _grow : function(){
            },
            _add : function($o){                           //单个扇形区
                //var me      = this
                var data    = $o.data
                var sprite  = $o.sprite 
                var pos     = $o.pos || {}

                _.each(data , function(o, i){              //扇形
                    var sector = new Sector({
                        id : i,
                        context : {
                            x : o.x || 0,
                            y : o.y || 0,

                            //clockwise : true,//逆时针
                            r : o.r  || 100,
                            r0: _.isNumber(o.r0) ? o.r0 : 0, 
                            startAngle : _.isNumber(o.startAngle) ? o.startAngle : 0,
                            endAngle   : _.isNumber(o.endAngle)   ? o.endAngle   : 90,

                            fillStyle  : o.fillStyle  || '#ff0000',
                            strokeStyle: o.strokeStyle|| '#000000',
                            lineWidth  : o.lineWidth  || 0
                            //lineJoin : "round"
                        }
                    });
                    sprite.addChild(sector)
                });

                sprite.context.x = pos.x || 0
                sprite.context.y = pos.y || 0
            }
        }; 
    
        return Graphs;
    } 
)
