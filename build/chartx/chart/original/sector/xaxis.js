define(
    "chartx/chart/original/sector/xaxis", [
        "chartx/components/xaxis/xAxis"
    ],
    function(xAxisBase) {

        var xAxis = function(opt, data) {
            xAxis.superclass.constructor.apply(this, arguments);
        };
        Chartx.extend(xAxis, xAxisBase, {

            updateLayout: function(data) {
                var me = this
                var txts = []

                _.each(me.sprite.children, function(children, i) {
                    if (!me.enabled) {
                        return
                    }
                    var o = data[i]

                    var x = o.x
                    var txt = children.children[0]

                    txt.context.x = x

                    var pre = txts[i - 1]
                    if (pre) {
                        if (pre.context.x + pre.getTextWidth() / 2 + 5 >= (x - txt.getTextWidth() / 2)) {
                            children.context.visible = false
                        }
                    }

                    txts.push(txt)

                    if (me.line.enabled) {
                        var line = children.children[1]
                        line.context.x = o.x
                    }
                })
            },

            draw: function(opt) {
                this._initConfig(opt);
                this.data = this._trimXAxis(this.dataSection, this.xGraphsWidth);
                this.data.unshift({
                    content: '0',
                    x: 0
                })
                this.layoutData = this.data

                this.setX(this.pos.x);
                this.setY(this.pos.y);

                if (this.enabled) { //this.display != "none"
                    this._widget();

                    if (!this.text.rotation) {
                        this._layout();
                    }
                }
            }
        });

        return xAxis;
    }
);