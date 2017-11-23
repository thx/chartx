import Component from "../component"
import Canvax from "canvax2d"
import _ from "underscore"

var Line = Canvax.Shapes.Line;
var Rect = Canvax.Shapes.Rect;

export default class dataZoom extends Component
{
	constructor(opt)
	{
		super();

		//0-1
        this.range = {
            start: 0,
            end: '',
            max : 1,
            min : 0
        };
        this.count = 1;
        this.pos = {
            x: 0,
            y: 0
        };
        this.left = {
            eventEnabled : true
        };
        this.right = {
            eventEnabled : true
        };
        this.center = {
            fillStyle : '#ffffff',
            globalAlpha : 0
        };

        this.w = 0;
        this.h = 40;

        this.color = opt.color || "#008ae6";

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

        
        this.range.max = 0;
        this.range.end = 0;
        this.disPart = {};
        this.barAddH = 8;
        this.barH = this.h - this.barAddH;
        this.barY = 6 / 2;
        this.btnW = 8;
        this.btnFillStyle = this.color;
        this._btnLeft = null;
        this._btnRight = null;
        this._underline = null;

        this.zoomBg = null;

        opt && _.deepExtend(this, opt);
        this._computeAttrs( opt );
        this.init(opt);
	}

	init(opt) 
	{
        var me = this;
        me.sprite = new Canvax.Display.Sprite({
            id : "dataZoom",
            context: {
                x: me.pos.x,
                y: me.pos.y
            }
        });
        me.sprite.noSkip=true;
        me.dataZoomBg = new Canvax.Display.Sprite({
            id : "dataZoomBg"
        });
        me.dataZoomBtns = new Canvax.Display.Sprite({
            id : "dataZoomBtns"
        });
        me.sprite.addChild( me.dataZoomBg );
        me.sprite.addChild( me.dataZoomBtns );

        me.widget();
        me._setLines();
    }

    destroy()
    {
        this.sprite.destroy();
    }

    reset( opt , zoomBgSp )
    {
        opt && _.deepExtend(this, opt);
        this._computeAttrs(opt);

        this.widget();
        //this._setLines();
        this.setZoomBg( zoomBgSp );
    }

    //计算属性
    _computeAttrs(opt)
    {
        
        if(!opt.range || !opt.range.max){
            this.range.max = this.count;
        }

        if(
            (this.range.end == '' && (!opt.range || !opt.range.end)) ||
            (parseInt(this.range.end) > this.count-1)
        ){
            this.range.end = this.count - 1;
        }

        //这里为了避免外面没有传入number
        this.range.start = parseInt(this.range.start);
        this.range.end   = parseInt(this.range.end);
        
        this.disPart = this._getDisPart();
        this.barH = this.h - this.barAddH;
    }

    widget() 
    {
        var me = this;
        var setLines = function(){
            me._setLines.apply(me, arguments);
        };
        if(me.bg.enabled){
            var bgRectCtx = {
                x: 0,
                y: me.barY,
                width: me.w,
                height: me.barH,
                lineWidth: me.bg.lineWidth,
                strokeStyle: me.bg.strokeStyle,
                fillStyle: me.bg.fillStyle
            };
            if( me._bgRect ){
                me._bgRect.animate( bgRectCtx , {
                    onUpdate : setLines
                });
            } else {
                me._bgRect = new Rect({
                    context: bgRectCtx
                });
                me.dataZoomBg.addChild( me._bgRect );
            }
            
        }

        if(me.underline.enabled){
            var underlineCtx = {
                xStart : me.range.start / me.count * me.w + me.btnW / 2,
                yStart : me.barY + me.barH + 2,
                xEnd   : (me.range.end + 1) / me.count * me.w  - me.btnW / 2,
                yEnd   : me.barY + me.barH + 2,
                lineWidth : me.underline.lineWidth,
                strokeStyle : me.underline.strokeStyle
            };

            if( me._underline ){
                me._underline.animate( underlineCtx , {
                    onUpdate : setLines
                });
            } else {
                me._underline = me._addLine( underlineCtx )
                me.dataZoomBg.addChild(me._underline); 
            };
            
        }


        var btnLeftCtx = {
            x: me.range.start / me.count * me.w,
            y: me.barY - me.barAddH / 2 + 1,
            width: me.btnW,
            height: me.barH + me.barAddH,
            fillStyle : me.btnFillStyle,
            cursor: me.left.eventEnabled && "move"
        }
        if(me._btnLeft){
            me._btnLeft.animate(btnLeftCtx,{
                onUpdate : setLines
            });
        } else {
            me._btnLeft = new Rect({
                id          : 'btnLeft',
                dragEnabled : me.left.eventEnabled,
                context: btnLeftCtx
            });
            me._btnLeft.on("draging" , function(){
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
            me._btnLeft.on("dragend" , function(){
               me.dragEnd( me.range );
            });
            this.dataZoomBtns.addChild( this._btnLeft );
        };

        var btnRightCtx = {
            x: (me.range.end + 1) / me.count * me.w - me.btnW,
            y: me.barY - me.barAddH / 2 + 1,
            width: me.btnW,
            height: me.barH + me.barAddH ,
            fillStyle : me.btnFillStyle,
            cursor : me.right.eventEnabled && "move"
        };

        if( me._btnRight ){
            me._btnRight.animate(btnRightCtx, {
                onUpdate : setLines
            });
        } else {
            me._btnRight = new Rect({
                id          : 'btnRight',
                dragEnabled : me.right.eventEnabled,
                context: btnRightCtx
            });
            me._btnRight.on("draging" , function(){
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
            me._btnRight.on("dragend" , function(){
                me.dragEnd( me.range );
            });
            this.dataZoomBtns.addChild( this._btnRight );
        };


        var rangeRectCtx = {
            x : btnLeftCtx.x + me.btnW,
            y : this.barY + 1,
            width : btnRightCtx.x - btnLeftCtx.x - me.btnW,
            height : this.barH - 1,
            fillStyle : me.center.fillStyle,
            globalAlpha : me.center.globalAlpha,
            cursor : "move"
        };
        if( this.rangeRect ){
            this.rangeRect.animate( rangeRectCtx , {
                onUpdate : setLines
            });
        } else {
            //中间矩形拖拽区域
            this.rangeRect = new Rect({
                id          : 'btnCenter',
                dragEnabled : true,
                context : rangeRectCtx
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
            this.dataZoomBtns.addChild( this.rangeRect );
        };

        if(!this.linesLeft){
            this.linesLeft = new Canvax.Display.Sprite({ id : "linesLeft" });
            if(this.left.eventEnabled){
                this._addLines({
                    sprite : this.linesLeft
                })
            };
            this.dataZoomBtns.addChild( this.linesLeft );
        };
        if(!this.linesRight){
            this.linesRight = new Canvax.Display.Sprite({ id : "linesRight" });
            if(this.right.eventEnabled){
                this._addLines({
                    sprite : this.linesRight
                })
            };
            this.dataZoomBtns.addChild( this.linesRight );
        };

        if(!this.linesCenter){
            this.linesCenter = new Canvax.Display.Sprite({ id : "linesCenter" });
            this._addLines({
                count  : 6,
                // dis    : 1,
                sprite : this.linesCenter,
                strokeStyle : this.btnFillStyle
            });
            this.dataZoomBtns.addChild( this.linesCenter );
        };
        
    }

    _getDisPart()
    {
        var me = this
        return {
            min : me.range.min / me.count * me.w,
            max : me.range.max / me.count * me.w
        }
    }

    _setRange()
    {
        var me = this;
        
        var start = (me._btnLeft.context.x / me.w) * (me.count - 1) ;
        var end = ( (me._btnRight.context.x + me.btnW) / me.w) * (me.count - 1);
        me.range.start = start;
        me.range.end = end;
        //@比例range @像素range @单位总数 @width
        me.dragIng( me.range , {
            start: me._btnLeft.context.x,
            end: me._btnRight.context.x + me.btnW
        } , me.count , me.w);
        me._setLines();
    }

    _setLines()
    {
        
        var me = this
        var linesLeft  = this.linesLeft;
        var linesRight = this.linesRight;
        var linesCenter = this.linesCenter;
        
        var btnLeft    = this._btnLeft;
        var btnRight   = this._btnRight;
        var btnCenter  = this.rangeRect;
        
        linesLeft.context.x = btnLeft.context.x + (btnLeft.context.width - linesLeft.context.width ) / 2
        linesLeft.context.y = btnLeft.context.y + (btnLeft.context.height - linesLeft.context.height ) / 2

        linesRight.context.x = btnRight.context.x + (btnRight.context.width - linesRight.context.width ) / 2
        linesRight.context.y = btnRight.context.y + (btnRight.context.height - linesRight.context.height ) / 2

        linesCenter.context.x = btnCenter.context.x + (btnCenter.context.width - linesCenter.context.width ) / 2
        linesCenter.context.y = btnCenter.context.y + (btnCenter.context.height - linesCenter.context.height ) / 2

        if(me.underline.enabled){
            me._underline.context.xStart = linesLeft.context.x + me.btnW / 2
            me._underline.context.xEnd   = linesRight.context.x + me.btnW / 2
        }
    }

    _addLines($o)
    {
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
    }

    _addLine($o)
    {
        var o = $o || {}
        var line = new Line({
            id     : o.id || '',
            context: {
                x: o.x || 0,
                y: o.y || 0,
                start : {
                    x : o.xStart || 0,
                    y : o.yStart || 0
                },
                end : {
                    x : o.xEnd || 0,
                    y : o.yEnd || 6
                },
                lineWidth: o.lineWidth || 1,
                strokeStyle: o.strokeStyle || '#ffffff'
            }
        });
        return line
    }

    setZoomBg( zoomBgSp )
    {
        
        if( this.zoomBg ){
            zoomBgSp.context.x = this.zoomBg.context.x;
            zoomBgSp.context.y = this.zoomBg.context.y;
            zoomBgSp.context.scaleY = this.zoomBg.context.scaleY;
            this.zoomBg.destroy();
        }
        this.zoomBg = zoomBgSp;
        this.dataZoomBg.addChild( zoomBgSp );
    }

}