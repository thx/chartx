define(
    "chartx/chart/venn/index", [
        'chartx/chart/index',
        'canvax/shape/Circle',
        'canvax/shape/Path',
        'chartx/layout/venn/index',
        'chartx/utils/colorformat',
        "chartx/components/tips/tip"
    ],
    function(Chart, Circle, Path, Venn, Color, Tip) {
        var Canvax = Chart.Canvax;
        return Chart.extend({
            init: function(node, data, opts) {
                this.colors = ['#fa8529', '#2494ed', '#7aa1ff', "#42a8d7", '#666666', '#7aa1ff'];
                this.padding = 15;
                this.nodeField = "sets";
                this.valueField = "size";
                this.labelField = "label";
                this._hasLabel = false;
                this.text = {
                    enabled: 0,
                    fillStyle: null,
                    fontSize: 18,
                    textAlign: "center",
                    textBaseline: "middle",
                    format: null
                };
                this.circle = {
                    fillAlpha: 0.25,
                    fillStyle: null,
                    strokeStyle: null,
                    lineWidth: 2
                };

                _.deepExtend(this, opts);
                this._initData(_.clone(data));
            },
            _initData: function(arr) {
                var data = [];
                var me = this;
                var titles = arr.shift(0);
                _.each(arr, function(row, iNode) {
                    var obj = {
                        iNode: iNode
                    };
                    _.each(titles, function(title, i) {
                        if (title == me.nodeField) {
                            var val = row[i];
                            if (!_.isArray(val)) {
                                val = [val];
                            };
                            obj.sets = val;
                        } else if (title == me.valueField) {
                            obj.size = row[i];
                        } else if (title == me.labelField) {
                            obj.label = row[i];
                            me._hasLabel = true;
                        };
                        obj[title] = row[i];
                    });
                    data.push(obj);
                });
                
                me.dataFrame = data;

                if (me._hasLabel) {
                    _.each(data, function(obj) {
                        if ( obj.sets.length > 1 && !obj.label) {
                            var label = [];
                            _.each(obj.sets, function(set) {
                                label.push( me._getNodeDataFromNode(set).label );
                            });
                            obj.label = label
                        };
                    });
                };

                return data;
            },
            _getNodeDataFromNode: function(node) {
                var n = null;
                _.each(this.dataFrame, function(d, i) {
                    if (d.sets == node) {
                        n = d;
                        return false;
                    };
                });
                return n;
            },
            draw: function() {
                this.stageTip = new Canvax.Display.Sprite({
                    id: 'tip'
                });
                this.core = new Canvax.Display.Sprite({
                    id: 'core'
                });

                this.stage.addChild(this.core);
                this.stage.addChild(this.stageTip);

                this._initModule();

                this._startDraw();

                this._drawEnd();

                this.inited = true;
            },
            _initModule: function() {
                this._tip = new Tip(this.tips, this.canvax.getDomContainer());
                this._tip._getDefaultContent = this._getTipDefaultContent;
            },
            _getColor: function(color, i, name) {
                if (_.isString(color)) {
                    return color;
                }
                if (_.isArray(color)) {
                    return color[i]
                }
                if (_.isFunction(color)) {
                    var c = color.apply(this, [i, name]);
                    if (c) {
                        return c;
                    }
                }
                return this.colors[i]
            },
            /*
            _getValue: function(name) {
                var val = null;
                _.each(this.dataFrame, function(obj) {
                    if (obj.sets.length == 1 && obj.sets[0] == name) {
                        val = obj.size;
                    }
                });
                return val
            },
            */
            getLabel: function(name) {
                var label = null;
                _.each(this.dataFrame, function(obj) {
                    if (obj.sets.join(",") == name && obj.label) {
                        label = obj.label;
                    }
                });
                return label;
            },
            _startDraw: function() {
                var me = this;

                (function(venn) {
                    "use strict";
                    venn.VennDiagram = function() {

                        var orientation = Math.PI / 2;
                        var normalize = true;
                        var solution = Venn.venn(me.dataFrame);
                        if (normalize) {
                            solution = Venn.normalizeSolution(solution, orientation);
                        };
                        var circles = Venn.scaleSolution(solution, me.width, me.height, me.padding);

                        var textCentres = computeTextCentres(circles, me.dataFrame);
                        var i = 0;
                        for (var c in circles) {

                            var obj = circles[c];

                            if (!obj.radius) continue;

                            var fillStyle = Color.colorRgb(me._getColor(me.circle.fillStyle, i, c));
                            var strokeStyle = me._getColor(me.circle.strokeStyle, i, c);
                            var circle = new Circle({
                                pointChkPriority: false,
                                context: {
                                    x: obj.x,
                                    y: obj.y,
                                    r: obj.radius,
                                    fillStyle: fillStyle.replace(")", "," + me.circle.fillAlpha + ")").replace("RGB", "RGBA"),
                                    strokeStyle: strokeStyle,
                                    lineWidth: me.circle.lineWidth
                                }
                            });
                            circle.index = i;
                            circle.name = c;
                            circle.data = me._getNodeDataFromNode(c);
                            me.core.addChild(circle);

                            circle.hover(function(e) {
                                var fillStyle = Color.colorRgb(
                                    me._getColor(me.circle.fillStyle, this.index, this.name)
                                );
                                var s = fillStyle.replace(")", "," + (me.circle.fillAlpha + 0.1) + ")").replace("RGB", "RGBA");
                                this.context.fillStyle = s;

                                e.tipsInfo = me._getInfoHandler(this, e);
                                me._tip.show(e);
                            }, function(e) {
                                var fillStyle = Color.colorRgb(
                                    me._getColor(me.circle.fillStyle, this.index, this.name)
                                );
                                var s = fillStyle.replace(")", "," + me.circle.fillAlpha + ")").replace("RGB", "RGBA");
                                this.context.fillStyle = s;
                                me._tip.hide(e);
                            });
                            circle.on("mousemove", function(e) {
                                e.tipsInfo = me._getInfoHandler(this, e);
                                me._tip.move(e);
                            });
                            i++;
                        };
                        i = 0;
                        for (var t in textCentres) {
                            if (t.indexOf(",") < 0 && !isNaN(textCentres[t].x)) {
                                var txtObj = textCentres[t];
                                var content = me.getLabel(t) || t;

                                var fillStyle = me._getColor(me.text.fillStyle, i, t);
                                var text = new Canvax.Display.Text(content, {
                                    context: {
                                        x: txtObj.x,
                                        y: txtObj.y,
                                        fillStyle: fillStyle,
                                        fontSize: me.text.fontSize,
                                        textAlign: me.text.textAlign,
                                        textBaseline: me.text.textBaseline
                                    }
                                });
                                me.core.addChild(text);
                            }
                            i++;
                        };



                        var previous = {};

                        // interpolate intersection area paths between previous and
                        // current paths
                        var pathtween = function(d) {
                            return function(t) {
                                var c = d.sets.map(function(set) {
                                    var start = previous[set],
                                        end = circles[set];
                                    if (!start) {
                                        start = {
                                            x: me.width / 2,
                                            y: me.height / 2,
                                            radius: 1
                                        };
                                    }
                                    if (!end) {
                                        end = {
                                            x: me.width / 2,
                                            y: me.height / 2,
                                            radius: 1
                                        };
                                    }
                                    return {
                                        'x': start.x * (1 - t) + end.x * t,
                                        'y': start.y * (1 - t) + end.y * t,
                                        'radius': start.radius * (1 - t) + end.radius * t
                                    };
                                });
                                return intersectionAreaPath(c);
                            };
                        };



                        var betweenPaths = [];
                        _.each(me.dataFrame, function(c) {
                            if (c.sets.length > 1) {
                                var path = pathtween(c)(1);
                                betweenPaths.push({
                                    path: path,
                                    data: c
                                });
                            }
                        });

                        _.each(betweenPaths, function(bd, i) {
                            var path = bd.path;
                            window.bpath = new Path({
                                hoverClone: false,
                                context: {
                                    path: path,
                                    lineWidth: 2,
                                    strokeStyle: "RGBA(255,255,255,0)",
                                    fillStyle : "RGBA(255,255,255,0)"
                                }
                            });
                            bpath.data = bd.data;
                            bpath.hover(function(e) {
                                this.context.strokeStyle = "RGBA(255,255,255,1)";
                                e.tipsInfo = me._getInfoHandler(this, e);
                                me._tip.show(e);
                            }, function() {
                                this.context.strokeStyle = "RGBA(255,255,255,0)";
                                me._tip.hide();
                            });
                            bpath.on("mousemove", function(e) {
                                e.tipsInfo = me._getInfoHandler(this, e);
                                me._tip.move(e);
                            });
                            me.core.addChild(bpath);
                        });

                    };



                    /** returns a svg path of the intersection area of a bunch of circles */
                    function intersectionAreaPath(circles) {
                        var stats = {};
                        venn.intersectionArea(circles, stats);
                        var arcs = stats.arcs;

                        if (arcs.length === 0) {
                            return "M 0 0";

                        } else if (arcs.length == 1) {
                            var circle = arcs[0].circle;
                            return circlePath(circle.x, circle.y, circle.radius);

                        } else {
                            // draw path around arcs
                            var ret = ["\nM", arcs[0].p2.x, arcs[0].p2.y];
                            for (var i = 0; i < arcs.length; ++i) {
                                var arc = arcs[i],
                                    r = arc.circle.radius,
                                    wide = arc.width > r;
                                ret.push("\nA", r, r, 0, wide ? 1 : 0, 1,
                                    arc.p1.x, arc.p1.y);
                            }
                            return ret.join(" ");
                        }
                    };



                    function circlePath(x, y, r) {
                        var ret = [];
                        ret.push("\nM", x, y);
                        ret.push("\nm", -r, 0);
                        ret.push("\na", r, r, 0, 1, 0, r * 2, 0);
                        ret.push("\na", r, r, 0, 1, 0, -r * 2, 0);
                        return ret.join(" ");
                    };

                    function circleMargin(current, interior, exterior) {
                        var margin = interior[0].radius - venn.distance(interior[0], current),
                            i, m;
                        for (i = 1; i < interior.length; ++i) {
                            m = interior[i].radius - venn.distance(interior[i], current);
                            if (m <= margin) {
                                margin = m;
                            }
                        }

                        for (i = 0; i < exterior.length; ++i) {
                            m = venn.distance(exterior[i], current) - exterior[i].radius;
                            if (m <= margin) {
                                margin = m;
                            }
                        }
                        return margin;
                    }

                    // compute the center of some circles by maximizing the margin of
                    // the center point relative to the circles (interior) after subtracting
                    // nearby circles (exterior)
                    function computeTextCentre(interior, exterior) {
                        // get an initial estimate by sampling around the interior circles
                        // and taking the point with the biggest margin
                        var points = [],
                            i;
                        for (i = 0; i < interior.length; ++i) {
                            var c = interior[i];
                            points.push({
                                x: c.x,
                                y: c.y
                            });
                            points.push({
                                x: c.x + c.radius / 2,
                                y: c.y
                            });
                            points.push({
                                x: c.x - c.radius / 2,
                                y: c.y
                            });
                            points.push({
                                x: c.x,
                                y: c.y + c.radius / 2
                            });
                            points.push({
                                x: c.x,
                                y: c.y - c.radius / 2
                            });
                        }
                        var initial = points[0],
                            margin = circleMargin(points[0], interior, exterior);
                        for (i = 1; i < points.length; ++i) {
                            var m = circleMargin(points[i], interior, exterior);
                            if (m >= margin) {
                                initial = points[i];
                                margin = m;
                            }
                        }

                        // maximize the margin numerically
                        var solution = venn.fmin(
                            function(p) {
                                return -1 * circleMargin({
                                    x: p[0],
                                    y: p[1]
                                }, interior, exterior);
                            }, [initial.x, initial.y], {
                                maxIterations: 500,
                                minErrorDelta: 1e-10
                            }).solution;
                        var ret = {
                            x: solution[0],
                            y: solution[1]
                        };

                        // check solution, fallback as needed (happens if fully overlapped
                        // etc)
                        var valid = true;
                        for (i = 0; i < interior.length; ++i) {
                            if (venn.distance(ret, interior[i]) > interior[i].radius) {
                                valid = false;
                                break;
                            }
                        }

                        for (i = 0; i < exterior.length; ++i) {
                            if (venn.distance(ret, exterior[i]) < exterior[i].radius) {
                                valid = false;
                                break;
                            }
                        }

                        if (!valid) {
                            if (interior.length == 1) {
                                ret = {
                                    x: interior[0].x,
                                    y: interior[0].y
                                };
                            } else {
                                var areaStats = {};
                                venn.intersectionArea(interior, areaStats);

                                if (areaStats.arcs.length === 0) {
                                    ret = {
                                        'x': 0,
                                        'y': -1000,
                                        disjoint: true
                                    };
                                } else {
                                    // take average of all the points in the intersection
                                    // polygon
                                    ret = venn.getCenter(areaStats.arcs.map(function(a) {
                                        return a.p1;
                                    }));
                                }
                            }
                        }

                        return ret;
                    }
                    venn.computeTextCentre = computeTextCentre;

                    function computeTextCentres(circles, areas) {
                        var ret = {};
                        for (var i = 0; i < areas.length; ++i) {
                            var area = areas[i].sets,
                                areaids = {};
                            for (var j = 0; j < area.length; ++j) {
                                areaids[area[j]] = true;
                            }

                            var interior = [],
                                exterior = [];
                            for (var setid in circles) {
                                if (setid in areaids) {
                                    interior.push(circles[setid]);
                                } else {
                                    exterior.push(circles[setid]);
                                }
                            }
                            var centre = computeTextCentre(interior, exterior);
                            ret[area] = centre;
                            if (centre.disjoint && (areas[i].size > 0)) {
                                //console.log("WARNING: area " + area + " not represented on screen");
                            }
                        }
                        return ret;
                    };
                    venn.computeTextCentres = computeTextCentres;

                })(Venn);

                Venn.VennDiagram()

            },
            _getTipDefaultContent: function(info) {
                return "<div style='color:#ffffff'><div style='padding-bottom:3px;'>" + info.label.toString() + "：" + info.value + "</div></div>";
            },
            _getInfoHandler: function(target) {

                var node = {
                    iNode: target.data.iNode,
                    name: target.data.sets,
                    label: target.data.label,
                    value: target.data.value,
                    fillStyle: target.context.strokeStyle
                };

                return node
            },
            _drawEnd: function() {
                this.stageTip.addChild(this._tip.sprite);
            }
        });
    }
)