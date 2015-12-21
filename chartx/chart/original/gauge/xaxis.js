define(
    "chartx/chart/original/gauge/xaxis",
    [
        "canvax/index",
        "canvax/display/Sprite",
        "canvax/shape/Line",
        'chartx/components/xaxis/xAxis',
    ],
    function(Canvax, Sprite, Line, xAxis){
 
        var xaxis = function(opt){
            this.width      = opt.width
            this.data       = [0, 250, 500, 750, 999]
            this.dataMax    = 999
            this.pos        = {
                x : 0,
                y : 0
            }

            this.sprite     = null;  
            this._xAxis     = null;

            this.init(opt)
        };
    
        xaxis.prototype = {
            init:function(opt){
                var self = this
                _.deepExtend(this, opt);
            },
            draw:function(opt){
                var self  = this;
                if (opt) {
                    _.deepExtend(this, opt);
                };
                self._widget()
            },
            _widget:function(){
                var me = this
                me.sprite = new Sprite({
                    id : '',
                    context : {
                        x : me.pos.x,
                        y : me.pos.y
                    }
                });

                me.lines  = new Sprite({
                    id : 'lines'
                });

                var xline = me._addLine({
                    xEnd : me.width
                })
                me.lines.addChild(xline)

                me._xAxis = new xAxis({
                    _trimXAxis : function(){
                        var tmpData = [];
                        var data = me.data, max = me.dataMax
                        for (var a = 0, al  = me.data.length; a < al; a++ ) {
                            var o = {
                                'content':data[a], 
                                'x':parseInt(data[a] / max * me.width)
                            }
                            tmpData.push( o )
                        }
                        return tmpData
                    },
                    _layout : function(){

                    }
                })
                me._xAxis.draw({
                    graphw : me.width,
                    pos    : {
                        x  : 0,
                        y  : -3 / 2 * me._xAxis.line.height 
                    },
                    line   : {
                        strokeStyle : '#455e7e'
                    },
                    text   : {
                        fillStyle : '#455e7e'
                    }
                })

                me.sprite.addChild(me.lines)
                me.sprite.addChild(me._xAxis.sprite)
            },
            _addLine:function($o){
                var o = $o || {}
                var line = new Line({
                    id     : o.id || '',
                    context: {
                        x: o.x || 0,
                        y: o.y || 0,
                        xEnd: o.xEnd || 10,
                        yEnd: o.yEnd || 0,
                        lineWidth: o.lineWidth || 1,
                        strokeStyle: o.strokeStyle || '#455e7e'
                    }
                });
                return line
            }
        }; 
    
        return xaxis;
    } 
)
