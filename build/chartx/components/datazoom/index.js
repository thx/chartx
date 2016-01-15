define(
    "chartx/components/datazoom/index", [
        "canvax/index",
        "canvax/shape/Rect",
        "canvax/shape/Line"
    ],
    function(Canvax, Rect, Line) {

        var dataZoom = function(opt) {
            //0-1
            this.range = {
                start: 0,
                end: 1
            };
            this.count = 1;
            this.pos = {
                x: 0,
                y: 0
            };
            this.w = 0;
            this.height = 46;

            this.color = "#70aae8";

            this.bg = {
                fillStyle : "#999",
                strokeStyle: "#999",
                lineWidth : 0
            }

            this.dragIng = function(){};
            this.dragEnd = function(){};

            opt && _.deepExtend(this, opt);
            
            this.barH = this.height - 6;
            this.barY = 6 / 2;
            this.btnW = 8;
            this.btnFillStyle = this.color;
            this.btnLeft = null;
            this.btnRgiht = null;

            this.init();
        };

        dataZoom.prototype = {
            init: function() {
                var me = this;
                this.sprite = new Canvax.Display.Sprite({
                    id : "dataZoom",
                    context: {
                        x: this.pos.x,
                        y: this.pos.y
                    }
                }); 
                this.dataZoomBg = new Canvax.Display.Sprite({
                    id : "dataZoomBg"
                });
                this.dataZoomBtns = new Canvax.Display.Sprite({
                    id : "dataZoomBtns"
                });
                this.sprite.addChild( this.dataZoomBg );
                this.sprite.addChild( this.dataZoomBtns );
                me.widget();
                me._setLines()
            },
            widget: function() {
                var me = this;
                var bgRect = new Rect({
                    context: {
                        x: 0,
                        y: this.barY,
                        width: this.w,
                        height: this.barH,
                        lineWidth: this.bg.lineWidth,
                        strokeStyle: this.bg.strokeStyle,
                        fillStyle: this.bg.fillStyle,
                        globalAlpha: 0.05
                    }
                });
                this.sprite.addChild(bgRect);


                this.btnLeft = new Rect({
                    id          : 'btnLeft',
                    dragEnabled : true,
                    context: {
                        x: this.range.start/this.count * this.w,
                        y: this.barY+1,
                        width: this.btnW,
                        height: this.barH-1,
                        fillStyle : this.btnFillStyle,
                        cursor: "move"
                    }
                });
                this.btnLeft.on("draging" , function(){
                   this.context.y = me.barY+1;
                   if(this.context.x<0){
                       this.context.x = 0;
                   };
                   if(this.context.x > (me.btnRight.context.x-me.btnW-2)){
                       this.context.x = me.btnRight.context.x-me.btnW-2
                   };
                   me.rangeRect.context.width = me.btnRight.context.x - this.context.x - me.btnW;
                   me.rangeRect.context.x = this.context.x + me.btnW;
                   me.setRange();
                });
                this.btnLeft.on("dragend" , function(){
                   me.dragEnd( me.range );
                });


                this.btnRight = new Rect({
                    id          : 'btnRight',
                    dragEnabled : true,
                    context: {
                        x: this.range.end / this.count * this.w - this.btnW,
                        y: this.barY+1,
                        width: this.btnW,
                        height: this.barH-1,
                        fillStyle : this.btnFillStyle,
                        cursor : "move"
                    }
                });
                this.btnRight.on("draging" , function(){
                    this.context.y = me.barY+1;
                    if( this.context.x < (me.btnLeft.context.x + me.btnW + 2) ){
                        this.context.x = me.btnLeft.context.x + me.btnW + 2;
                    };
                    if( this.context.x > me.w - me.btnW ){
                        this.context.x = me.w - me.btnW;
                    };
                    me.rangeRect.context.width = this.context.x - me.btnLeft.context.x - me.btnW;
                    me.setRange();
                });
                this.btnRight.on("dragend" , function(){
                    me.dragEnd( me.range );
                });


                //中间矩形拖拽区域
                this.rangeRect = new Rect({
                    id          : 'btnCenter',
                    dragEnabled : true,
                    context : {
                        x : this.btnLeft.context.x + me.btnW,
                        y : this.barY + 1,
                        width : this.btnRight.context.x - this.btnLeft.context.x - me.btnW,
                        height : this.barH - 1,
                        fillStyle : this.btnFillStyle,
                        globalAlpha : 0.3,
                        cursor : "move"
                    }
                });
                this.rangeRect.on("draging" , function(e){
                    this.context.y = me.barY + 1;
                    if( this.context.x < me.btnW ){
                        this.context.x = me.btnW; 
                    };
                    if( this.context.x > me.w - this.context.width - me.btnW ){
                        this.context.x = me.w - this.context.width - me.btnW;
                    };
                    me.btnLeft.context.x  = this.context.x - me.btnW;
                    me.btnRight.context.x = this.context.x + this.context.width;
                    me.setRange();
                });
                this.rangeRect.on("dragend" , function(){
                    me.dragEnd( me.range );
                });

                this.linesLeft = new Canvax.Display.Sprite({ id : "linesLeft" });
                this._addLines({
                    sprite : this.linesLeft,
                })
                this.linesRight = new Canvax.Display.Sprite({ id : "linesRight" });
                this._addLines({
                    sprite : this.linesRight,
                })
                this.linesCenter = new Canvax.Display.Sprite({ id : "linesCenter" });
                this._addLines({
                    count  : 6,
                    // dis    : 1,
                    sprite : this.linesCenter,
                })

                this.dataZoomBtns.addChild( this.rangeRect );
                this.dataZoomBtns.addChild( this.linesCenter );

                this.dataZoomBtns.addChild( this.btnLeft );
                this.dataZoomBtns.addChild( this.btnRight );

                this.dataZoomBtns.addChild( this.linesLeft );
                this.dataZoomBtns.addChild( this.linesRight );
            },
            setRange : function(){
                var start = (this.btnLeft.context.x / this.w)*this.count ;
                var end = ( (this.btnRight.context.x + this.btnW) / this.w)*this.count;
                this.range.start = start;
                this.range.end = end;
                this.dragIng( this.range );

                this._setLines()
            },

            _setLines : function(){
                var me = this
                var linesLeft  = me.dataZoomBtns.getChildById('linesLeft')
                var linesRight = me.dataZoomBtns.getChildById('linesRight')
                var linesCenter = me.dataZoomBtns.getChildById('linesCenter')
                
                var btnLeft    = me.dataZoomBtns.getChildById('btnLeft')
                var btnRight   = me.dataZoomBtns.getChildById('btnRight')
                var btnCenter  = me.dataZoomBtns.getChildById('btnCenter')
                
                linesLeft.context.x = btnLeft.context.x + (btnLeft.context.width - linesLeft.context.width ) / 2
                linesLeft.context.y = btnLeft.context.y + (btnLeft.context.height - linesLeft.context.height ) / 2

                linesRight.context.x = btnRight.context.x + (btnRight.context.width - linesRight.context.width ) / 2
                linesRight.context.y = btnRight.context.y + (btnRight.context.height - linesRight.context.height ) / 2

                linesCenter.context.x = btnCenter.context.x + (btnCenter.context.width - linesCenter.context.width ) / 2
                linesCenter.context.y = btnCenter.context.y + (btnCenter.context.height - linesCenter.context.height ) / 2
            },

            _addLines:function($o){
                var me = this
                var count  = $o.count || 2
                var sprite = $o.sprite
                var dis    = $o.dis || 2
                for(var a = 0, al = count; a < al; a++){
                    sprite.addChild(me._addLine({
                        x : a * dis
                    }))
                }
                sprite.context.width = a * dis - 1, sprite.context.height = 6
            },

            _addLine:function($o){
                var o = $o || {}
                var line = new Line({
                    id     : o.id || '',
                    context: {
                        x: o.x || 0,
                        y: o.y || 0,
                        xEnd: o.xEnd || 0,
                        yEnd: o.yEnd || 6,
                        lineWidth: o.lineWidth || 1,
                        strokeStyle: o.strokeStyle || '#ffffff'
                    }
                });
                return line
            }
        };
        return dataZoom;
    }
);

