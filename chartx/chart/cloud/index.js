define(
    'chartx/chart/cloud/index', [
        'chartx/chart/index',
        'chartx/layout/cloud/index'
    ],
    function(Chart, Layout) {
        /*
         *@node chart在dom里的目标容器节点。
         */
        var Canvax = Chart.Canvax;

        return Chart.extend({
            // element : null,
            // opts    : null,
            init: function(node, data, opts) {
                // this.element = node;
                this.data = data;
                this.options = opts;
                _.deepExtend(this, opts);
                this.dataFrame = this._initData(data, this);
            },
            draw: function() {

                this.core = new Canvax.Display.Sprite({
                    id: 'core',
                    context : {
                        x : this.width / 2,
                        y : this.height / 2
                    }
                });

                this.stage.addChild(this.core);

                this._getLayoutData();

                this.inited = true;
            },
            _getLayoutData: function() {
                var me = this;
                var layout = Layout()
                    .size([me.width, me.height])
                    .words([
                        "Hello", "world", "normally", "you", "want", "more", "words",
                        "than", "this", "world", "normally", "you", "want", "more", "words",
                        "than", "this", "world", "normally", "you", "want", "more", "words",
                        "than", "this"
                    ].map(function(d) {
                        return {
                            text: d,
                            size: 12 + Math.random() * 50
                        };
                    }))
                    .padding(5)
                    .rotate(function() {
                        return (~~(Math.random() * 6) - 3) * 30;
                    })
                    //.font("Impact")
                    .fontSize(function(d) {
                        return d.size;
                    })
                    .on("end", draw);

                layout.start();

                function draw(words) {
                    _.each(words, function(tag) {
                        console.log(tag.height/ 2)
                        var tagTxt = new Canvax.Display.Text(tag.text, {
                            context: {
                                x: tag.x ,
                                y: tag.y ,
                                fontSize : tag.size,
                                fontFamily : tag.font,
                                rotation : tag.rotate,
                                rotateOrigin : {
                                    x : 0,
                                    y : 0
                                },
                                textBaseline : "middle",
                                textAlign : "center"
                            }
                        });
                        me.core.addChild(tagTxt);
                    });


                    return;
                    d3.select("body").append("svg")
                        .attr("width", layout.size()[0])
                        .attr("height", layout.size()[1])
                        .append("g")
                        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                        .selectAll("text")
                        .data(words)
                        .enter().append("text")
                        .style("font-size", function(d) {
                            return d.size + "px";
                        })
                        .style("font-family", "Impact")
                        .style("fill", function(d, i) {
                            return fill(i);
                        })
                        .attr("text-anchor", "middle")
                        .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .text(function(d) {
                            return d.text;
                        });
                }
            }
        });
    });