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
                    id: 'core'
                });
                
                this.stage.addChild( this.core );

                this._getLayoutData();

                this.inited = true;
            },
            _getLayoutData: function() {
                var me = this;
                var layout = Layout()
                    .size([300, 600])
                    .words([
                        "Hello", "world", "normally", "you", "want", "more", "words",
                        "than", "this"
                    ].map(function(d) {
                        return {
                            text: d,
                            size: 10 + Math.random() * 90,
                            //test: "haha"
                        };
                    }))
                    .padding(5)
                    .rotate(function() {
                        return ~~(Math.random() * 2) * 90;
                    })
                    .font("Impact")
                    .fontSize(function(d) {
                        return d.size;
                    })
                    .on("end", draw);

                layout.start();

                function draw(words) {
                    debugger;

                    _.each( words , function(tag){
                        var tagTxt = new Canvax.Display.Text( tag.text , {
                            x : tag.x + me.width / 2,
                            y : tag.y + me.height / 2
                        } );
                        me.core.addChild( tagTxt );
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