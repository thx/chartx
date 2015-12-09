define(
    "chartx/components/datazoom/index", [
        "canvax/index",
        "canvax/shape/Rect"
    ],
    function(Canvax, Rect) {

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
            this.h = dataZoom.height;

            this.dragIng = function(){};
            this.dragEnd = function(){};

            opt && _.deepExtend(this, opt);
            this.barH = this.h - 6;
            this.barY = 6 / 2;
            this.btnW = 8;
            this.btnFillStyle = "blue";
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
            },
            widget: function() {
                var bgRect = new Rect({
                    context: {
                        x: 0,
                        y: this.barY,
                        width: this.w,
                        height: this.barH,
                        lineWidth: 1,
                        strokeStyle: "#e6e6e6"
                    }
                });
                var me = this;

                this.sprite.addChild(bgRect);
                this.btnLeft = new Rect({
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
                   me.rangeRect.context.width = me.btnRight.context.x - this.context.x;
                   me.rangeRect.context.x = this.context.x + me.btnW;
                   me.setRange();
                });
                this.btnLeft.on("dragend" , function(){
                   me.dragEnd( me.range );
                });


                this.btnRight = new Rect({
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
                    me.rangeRect.context.width = this.context.x - me.btnLeft.context.x;
                    me.setRange();
                });
                this.btnRight.on("dragend" , function(){
                    me.dragEnd( me.range );
                });


                this.dataZoomBtns.addChild( this.btnLeft );
                this.dataZoomBtns.addChild( this.btnRight );

                this.rangeRect = new Rect({
                    dragEnabled : true,
                    context : {
                        x : this.btnLeft.context.x + me.btnW,
                        y : this.barY + 1,
                        width : this.btnRight.context.x - this.btnLeft.context.x - me.btnW,
                        height : this.barH - 1,
                        fillStyle : this.btnFillStyle,
                        globalAlpha : 0.1,
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
                this.dataZoomBtns.addChild( this.rangeRect );
            },
            setRange : function(){
                var start = (this.btnLeft.context.x / this.w)*this.count ;
                var end = ( (this.btnRight.context.x + this.btnW) / this.w)*this.count;
                this.range.start = start;
                this.range.end = end;
                this.dragIng( this.range );
            }
        };

        dataZoom.height = 46;
        return dataZoom;
    }
);