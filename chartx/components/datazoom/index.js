define(
    "chartx/components/datazoom/index", [
        "canvax/index",
        "canvax/shape/Rect"
    ],
    function(Canvax, Rect) {

        var dataZoom = function(opt, bg) {
            this._bg = bg;
            this.range = {
                start: 0,
                end: 0
            };
            this.pos = {
                x: 0,
                y: 0
            };
            this.w = 0;
            this.h = dataZoom.height;

            this._doneHandle = null;
            this.done = function(fn) {
                this._doneHandle = fn;
            };
            opt && _.deepExtend(this, opt);
            this.barH = this.h - 6;
            this.barY = 6 / 2;
            this.init();
        };

        dataZoom.prototype = {
            init: function() {
                var me = this;
                this.sprite = new Canvax.Display.Sprite({
                    context: {
                        x: this.pos.x,
                        y: this.pos.y
                    }
                });

/*
                var graphssp = this._bg.sprite;
                graphssp.context.x = 0;
                graphssp.context.y = this.h - this.barY;
                graphssp.context.scaleY = this.barH / this._bg.h;
                this.sprite.addChild(graphssp);
                */


                setTimeout(function() {
                    me.widget();
                }, 10);
            },
            widget: function() {
                debugger
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
                this.sprite.addChild(bgRect);

                this._done();
            },
            _done: function() {
                _.isFunction(this._doneHandle) && this._doneHandle.apply(this, []);
            }
        };

        dataZoom.height = 46;

        return dataZoom;
    }
);