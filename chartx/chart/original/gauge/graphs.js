define(
    "chartx/chart/original/gauge/graphs",
    [
        "canvax/index",
        "canvax/shape/Sector",
        "canvax/animation/Tween",
        "chartx/utils/tools",
        "canvax/shape/Circle",
        "canvax/shape/BrokenLine",
        "canvax/display/Text",
        "canvax/animation/AnimationFrame"
    ],
    function(Canvax, Sector, Tween , Tools, Circle, BrokenLine, Text, AnimationFrame){
 
        var Graphs = function(opt,domRoot){

            this.domRoot = domRoot;
            this.w    = 0;
            this.h    = 0;

            this.maxR = 0;
            // this.autoCenter = true

            this.dis  = {
                outAndIn  : 10,                  //外圈与内圈距离
                textAndIn : 15                   //内圈与文字距离
            }

            this.outSide = {
                totalValue : 100,
                totalAngle : 0,
                thickness  : 3,
                startAngle : 165,
                endAngle   : 15,
                fillStyle  : '#86A2AF'
            }
            this.inSide = {
                totalValue : 100,
                totalAngle : 0,
                thickness  : 10,
                startAngle : 165,
                endAngle   : 15,
                fillStyle  : '#454B54',
                globalAlpha:0.5,
            }

            this.describe = {                    //描述
                count : 8
            }

            this.center   = {                    //中心区域
                title : {
                    content : 0,
                    context : {
                        x       : 0,
                        y       : -25,
                        fillStyle : '#86A2AF',
                        fontSize : 50,
                        fontWeight : 'bold',
                        fontFamily : 'Tahoma'
                    }
                },
                subtitle : {
                    content : '0-100 用户数',
                    context : {
                        x       : 0,
                        y       : 20,
                        fillStyle : '#86A2AF',
                        fontSize : 14
                    }
                }

            }

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

                me.maxR = Math.min(me.pos.y, parseInt(me.w / 2)) 

                //外圈
                var item = new Canvax.Display.Sprite({ id : 'item_' + 1});
                me.sprite.addChild(item)
                me.outSide.r = me.maxR
                me.outSide.r0= me.maxR - me.outSide.thickness
                me._add({
                    config : me.outSide,
                    sprite : item
                })

                //内圈
                var item = new Canvax.Display.Sprite({ id : 'item_' + 2});
                me.sprite.addChild(item)
                me.inSide.r = me.maxR - me.dis.outAndIn
                me.inSide.r0= me.maxR - me.dis.outAndIn - me.inSide.thickness
                me._add({
                    config : me.inSide,
                    sprite : item
                })

                me._drawDescribe()

                me._drawTitle()

                me.sprite.context.x = me.pos.x, me.sprite.context.y = me.pos.y

                //自动居中
                // if(me.autoCenter){
                    // me.sprite.context.y = (me.h - (me.maxR + 30) ) / 2 + me.maxR
                // }
                // me.sprite.addChild(me._test({}))

                // me.updateTitle({
                //     title : 28888
                // })
            },

            updateTitle:function($o){
                var me = this
                var center = me.sprite.getChildById('center')
                var title  = center.getChildAt(0)
                var subtitle = center.getChildAt(1)
                var content = $o.title || 0
                // title.resetText(context)

                AnimationFrame.registTween({
                    from : {num:title.text},
                    to   : {num:content},
                    onUpdate : function(){
                        title.resetText(parseInt(this.num))
                    },
                    // duration:3000
                })
            },

            updateRange:function($o){
                var center = me.sprite.getChildById('center') 
                var content = $o.subtitle || ''
                subtitle.resetText(content)
            },

            _drawDescribe:function(){
                var me = this
                var describe = new Canvax.Display.Sprite({ id : 'describe'});
                var lines = new Canvax.Display.Sprite({ id : 'lines'});
                var txts  = new Canvax.Display.Sprite({ id : 'txts'});
                // me.outSide.totalAngle = (360 - me.outSide.startAngle) + me.outSide.endAngle
                me.inSide.totalAngle = (360 - me.inSide.startAngle) + me.inSide.endAngle
                for(var a = 0,al = me.describe.count; a < al; a++){
                    var o = _.isFunction(me.describe.format) ? me.describe.format(a) : null
                    if(o){
                        var scale = _.isNumber(o.scale) ? o.scale : (a / describe_data.length)
                        var angle = scale * me.inSide.totalAngle + me.inSide.startAngle
                        // angle = angle >= 360 ? angle - 360 : angle
                        if(o.line && o.line.enabled){
                            var p1 = me._getRPoint(0,0,me.inSide.r,me.inSide.r,angle)
                            var p2 = me._getRPoint(0,0,me.inSide.r0,me.inSide.r0,angle)

                            // me.sprite.addChild(me._test(p1))
                            // me.sprite.addChild(me._test(p2))
                            //线条
                            var bline = new BrokenLine({ 
                                id: "brokenline",
                                context: {
                                    pointList: [[p1.x, p1.y], [p2.x, p2.y]],
                                    strokeStyle : o.line.strokeStyle || '#ffffff',
                                    lineWidth : o.line.lineWidth || 2
                                }
                            });
                            lines.addChild(bline)
                        }

                        var r = me.inSide.r0 - me.dis.textAndIn
                        var p = me._getRPoint(0,0,r,r,angle)

                        //文字
                        var txt = new Text(o.content , {
                            context: {
                                x: p.x,
                                y: p.y,
                                fillStyle: o.context.fillStyle || '#ff0000',
                                fontSize: o.context.fontSize || 10,
                                rotation: angle + 90,
                                textAlign: 'center',
                                textBaseline: 'middle'
                            }
                        });
                        // me.sprite.addChild(me._test({x:p.x, y:p.y, fillStyle:'#00ffff'}))
                        txts.addChild(txt)
                    }
                }

                describe.addChild(lines)
                describe.addChild(txts)

                me.sprite.addChild(describe)
            },

            _drawTitle:function(){
                var me = this
                var center = new Canvax.Display.Sprite({ id : 'center'});
                //中心区域信息
                var o = me.center.title
                var title = new Text(o.content, {
                    context: {
                        x: o.context.x || 0,
                        y: o.context.y || 0,
                        fillStyle: o.context.fillStyle || '#ff0000',
                        fontSize: o.context.fontSize || 12,
                        fontWeight : o.context.fontWeight || 'bold',
                        fontFamily : o.context.fontFamily || 'Tahoma',
                        textAlign: 'center',
                        textBaseline: 'middle'
                    }
                });
                center.addChild(title)

                var o = me.center.subtitle
                var subtitle = new Text(o.content, {
                    context: {
                        x: o.context.x || 0,
                        y: o.context.y || 0,
                        fillStyle: o.context.fillStyle || '#ff0000',
                        fontSize: o.context.fontSize || 12,
                        fontWeight : o.context.fontWeight || 'bold',
                        fontFamily : o.context.fontFamily || '微软雅黑',
                        textAlign: 'center',
                        textBaseline: 'middle'
                    }
                });
                center.addChild(subtitle)

                me.sprite.addChild(center)
            },

            _getRPoint:function(x0, y0, xr, yr, r){
                r = r * Math.PI / 180
                return {x:Math.cos(r) * xr + x0, y:Math.sin(r) * yr + y0}
            },
            _test:function(o){
                var circle = new Circle({                  //圆
                    id : "circle",
                    context : {
                        x           : o.x || 0,
                        y           : o.y || 0,
                        r           : 2,
                        fillStyle   : o.fillStyle || '#ff0000',
                    }
                });
                return circle
            },
            _grow : function(){
            },
            _add : function($o){                           //单个扇形区
                var me      = this
                var sprite  = $o.sprite 
                var o       = $o.config
                var gauge = new Sector({
                    context : {
                        x : o.x || 0,
                        y : o.y || 0,
                        r : o.r  || 100,
                        r0: _.isNumber(o.r0) ? o.r0 : 100, 
                        startAngle : _.isNumber(o.startAngle) ? o.startAngle : 180,
                        endAngle   : _.isNumber(o.endAngle)   ? o.endAngle   : 360,

                        fillStyle  : o.fillStyle  || '#ff0000',
                        strokeStyle: o.strokeStyle|| '#000000',
                        lineWidth  : o.lineWidth  || 0,
                        globalAlpha: o.globalAlpha|| 1,
                    }
                })
                sprite.addChild(gauge)
            }
        }; 
    
        return Graphs;
    } 
)
