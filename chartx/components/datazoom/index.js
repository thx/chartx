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
                end: 1,
                max : '',
                min : 2,
            };
            this.count = 1;
            this.pos = {
                x: 0,
                y: 0
            };
            this.left = {
                eventEnabled : true
            },
            this.right = {
                eventEnabled : true
            },
            this.center = {
                fillStyle : '#ffffff',
                globalAlpha : 0
            }

            this.w = 0;
            this.h = 46;

            this.color = "#008ae6";

            this.bg = {
                enabled : true,
                fillStyle : "",
                strokeStyle: "#e6e6e6",
                lineWidth : 1
            }

            this.underline = {
                enabled : true,
                strokeStyle : this.color,
                lineWidth : 2
            }

            this.dragIng = function(){};
            this.dragEnd = function(){};

            opt && _.deepExtend(this, opt);

            if(!this.range.max)
                this.range.max = this.count;
            this.disPart = this._getDisPart()
            this.barAddH = 8
            this.barH = this.h - this.barAddH;
            this.barY = 6 / 2;
            this.btnW = 8;
            this.btnFillStyle = this.color;
            this._btnLeft = null;
            this._btnRight = null;
            this._underline = null;

            this.init();
        };

        dataZoom.prototype = {
            init: function() {
                var me = this;
                me.sprite = new Canvax.Display.Sprite({
                    id : "dataZoom",
                    context: {
                        x: me.pos.x,
                        y: me.pos.y
                    }
                }); 
                me.dataZoomBg = new Canvax.Display.Sprite({
                    id : "dataZoomBg"
                });
                me.dataZoomBtns = new Canvax.Display.Sprite({
                    id : "dataZoomBtns"
                });
                me.sprite.addChild( me.dataZoomBg );
                me.sprite.addChild( me.dataZoomBtns );
                me.widget();
                me._setLines()
            },
            widget: function() {
                var me = this;
                if(me.bg.enabled){
                    var bgRect = new Rect({
                        context: {
                            x: 0,
                            y: me.barY,
                            width: me.w,
                            height: me.barH,
                            lineWidth: me.bg.lineWidth,
                            strokeStyle: me.bg.strokeStyle,
                            fillStyle: me.bg.fillStyle
                        }
                    });
                    me.dataZoomBg.addChild(bgRect);
                }

                if(me.underline.enabled){
                    me._underline = me._addLine({
                        xStart : me.range.start/me.count * me.w + me.btnW / 2,
                        yStart : me.barY + me.barH + 2,
                        xEnd   : me.range.end/me.count * me.w - me.btnW / 2,
                        yEnd   : me.barY + me.barH + 2,
                        lineWidth : me.underline.lineWidth,
                        strokeStyle : me.underline.strokeStyle,
                    })
                    me.dataZoomBg.addChild(me._underline); 
                }

                this._btnLeft = new Rect({
                    id          : 'btnLeft',
                    dragEnabled : this.left.eventEnabled,
                    context: {
                        x: this.range.start/this.count * this.w,
                        y: this.barY - this.barAddH / 2 + 1,
                        width: this.btnW,
                        height: this.barH + this.barAddH,
                        fillStyle : this.btnFillStyle,
                        cursor: this.left.eventEnabled && "move"
                    }
                });
                this._btnLeft.on("draging" , function(){
                   this.context.y = me.barY - me.barAddH / 2 + 1
                   if(this.context.x < 0){
                       this.context.x = 0;
                   };
                   if(this.context.x > (me._btnRight.context.x - me.btnW - 2)){
                       this.context.x = me._btnRight.context.x - me.btnW - 2
                   };
                   if(me._btnRight.context.x + me.btnW - this.context.x > me.disPart.max){
                       this.context.x = me._btnRight.context.x + me.btnW - me.disPart.max
                   }
                   if(me._btnRight.context.x + me.btnW - this.context.x < me.disPart.min){
                       this.context.x = me._btnRight.context.x + me.btnW - me.disPart.min
                   }

                   me.rangeRect.context.width = me._btnRight.context.x - this.context.x - me.btnW;
                   me.rangeRect.context.x = this.context.x + me.btnW;
                   me._setRange();
                });
                this._btnLeft.on("dragend" , function(){
                   me.dragEnd( me.range );
                });


                this._btnRight = new Rect({
                    id          : 'btnRight',
                    dragEnabled : this.right.eventEnabled,
                    context: {
                        x: this.range.end / this.count * this.w - this.btnW,
                        y: this.barY - this.barAddH / 2 + 1,
                        width: this.btnW,
                        height: this.barH + this.barAddH ,
                        fillStyle : this.btnFillStyle,
                        cursor : this.right.eventEnabled && "move"
                    }
                });
                this._btnRight.on("draging" , function(){
                    this.context.y = me.barY - me.barAddH / 2 + 1
                    if( this.context.x > me.w - me.btnW ){
                        this.context.x = me.w - me.btnW;
                    };
                    if( this.context.x + me.btnW - me._btnLeft.context.x > me.disPart.max){
                        this.context.x = me.disPart.max - (me.btnW - me._btnLeft.context.x)
                    }
                    if( this.context.x + me.btnW - me._btnLeft.context.x < me.disPart.min){
                        this.context.x = me.disPart.min - (me.btnW - me._btnLeft.context.x)
                    }

                    me.rangeRect.context.width = this.context.x - me._btnLeft.context.x - me.btnW;
                    me._setRange();
                });
                this._btnRight.on("dragend" , function(){
                    me.dragEnd( me.range );
                });


                //中间矩形拖拽区域
                this.rangeRect = new Rect({
                    id          : 'btnCenter',
                    dragEnabled : true,
                    context : {
                        x : this._btnLeft.context.x + me.btnW,
                        y : this.barY + 1,
                        width : this._btnRight.context.x - this._btnLeft.context.x - me.btnW,
                        height : this.barH - 1,
                        fillStyle : me.center.fillStyle,
                        globalAlpha : me.center.globalAlpha,
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
                    me._btnLeft.context.x  = this.context.x - me.btnW;
                    me._btnRight.context.x = this.context.x + this.context.width;
                    me._setRange();
                });
                this.rangeRect.on("dragend" , function(){
                    me.dragEnd( me.range );
                });

                this.linesLeft = new Canvax.Display.Sprite({ id : "linesLeft" });
                if(this.left.eventEnabled){
                    this._addLines({
                        sprite : this.linesLeft,
                    })
                }
                this.linesRight = new Canvax.Display.Sprite({ id : "linesRight" });
                if(this.right.eventEnabled){
                    this._addLines({
                        sprite : this.linesRight,
                    })
                }
                this.linesCenter = new Canvax.Display.Sprite({ id : "linesCenter" });
                this._addLines({
                    count  : 6,
                    // dis    : 1,
                    sprite : this.linesCenter,
                    strokeStyle : this.btnFillStyle
                })

                this.dataZoomBtns.addChild( this.rangeRect );
                this.dataZoomBtns.addChild( this.linesCenter );

                this.dataZoomBtns.addChild( this._btnLeft );
                this.dataZoomBtns.addChild( this._btnRight );

                this.dataZoomBtns.addChild( this.linesLeft );
                this.dataZoomBtns.addChild( this.linesRight );
            },

            _getDisPart : function(){
                var me = this
                return {
                    min : me.range.min / me.count * me.w,
                    max : me.range.max / me.count * me.w
                }
            },
            _setRange : function(){
                var me = this
                var start = (me._btnLeft.context.x / me.w) * me.count ;
                var end = ( (me._btnRight.context.x + me.btnW) / me.w) * me.count;
                me.range.start = start;
                me.range.end = end;
                me.dragIng( me.range );

                me._setLines()
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

                if(me.underline.enabled){
                    me._underline.context.xStart = me.range.start/me.count * me.w + me.btnW / 2
                    me._underline.context.xEnd   = me.range.end/me.count * me.w - me.btnW / 2
                }
            },

            _addLines:function($o){
                var me = this
                var count  = $o.count || 2
                var sprite = $o.sprite
                var dis    = $o.dis || 2
                for(var a = 0, al = count; a < al; a++){
                    sprite.addChild(me._addLine({
                        x : a * dis,
                        strokeStyle : $o.strokeStyle || ''
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
                        xStart : o.xStart || 0,
                        yStart : o.yStart || 0,
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

