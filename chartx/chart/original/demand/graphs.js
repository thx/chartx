define(
    "chartx/chart/original/demand/graphs", [
        "canvax/index",
        "canvax/shape/Circle",
        "canvax/shape/Sector"
    ],
    function(Canvax , Circle , Sector) {
        var Graphs = function(opt) {
            this.sprite = null;

            this.w = 0;
            this.h = 0;
            //圆心原点坐标
            this.center ={
                name : "center",
                r : 30,
                fillStyle : "#70629e",
                fontSize : 15,
                fontColor: "#ffffff",
            };


            this.coordinate = opt.coordinate; //坐标系，这里会引入极坐标系
            this.dataFrame = opt.dataFrame;

            _.deepExtend(this, opt.options);

            this.init();
        };

        Graphs.prototype = {
            init: function() {
                this.sprite = new Canvax.Display.Sprite({
                    id: "graphsEl"
                });
            },
            draw: function(){
                var cx = this.coordinate.center.x;
                var cy = this.coordinate.center.y;
                this._center = new Circle({
                    context : {
                        x : cx,
                        y : cy,
                        fillStyle : this.center.fillStyle,
                        r : this.center.r
                    }
                });
                this._label = new Canvax.Display.Text(this.center.name, {
                    context: {
                        x: cx,
                        y: cy,
                        fontSize: this.center.fontSize,
                        textAlign: "center",
                        textBaseline: "middle",
                        fillStyle: this.center.fontColor
                    }
                });


                this.sprite.addChild( this._center );
                this.sprite.addChild( this._label );
            },
            _coordinateTest: function(){
                var r = 150;
                var arcs = this.coordinate.getRadiansAtR( r );
                var me = this;
                _.each( arcs, function( arc ){
                    var sector = new Sector({
                        context: {
                            x: me.coordinate.center.x,
                            y: me.coordinate.center.y,
                            r: r,
                            startAngle: arc[0].radian*180/Math.PI,
                            endAngle: arc[1].radian*180/Math.PI, //secc.endAngle,
                            strokeStyle: "#ccc",
                            lineWidth:1
                        },
                    });
                    me.sprite.addChild( sector );
                } );
            }
        };
        return Graphs;
    }
);