define(
    "chartx/chart/venn/index",
    [
        'chartx/chart/index',
        'canvax/shape/Circle',
        'chartx/layout/venn/index',
        'chartx/utils/colorformat',
        "chartx/components/tips/tip"
    ],
    function(Chart , Circle , Venn , Color , Tip){
        var Canvax = Chart.Canvax;
        return Chart.extend({
            init : function( node , data , opts ){
                this.colors = ['#fa8529','#2494ed','#7aa1ff',"#42a8d7",'#666666',  '#7aa1ff' ];
                this.padding = 15;
                this.nodeField  = "sets";
                this.valueField = "size";
                this.labelField = "label";
                this.text = {
                    enabled   : 0,
                    fillStyle : null,
                    fontSize  : 18,
                    textAlign : "center",
                    textBaseline : "middle",
                    format    : null
                };
                this.circle = {
                    fillAlpha : 0.25,
                    fillStyle : null,
                    strokeStyle: null,
                    lineWidth : 2
                };

                _.deepExtend( this , opts );
                this.data = this._initData(data);
            },
            _initData : function( arr ){
                var data = [];
                var me   = this;
                var titles = arr.shift(0);
                _.each( arr , function( row ){
                    var obj = {};
                    _.each( titles , function( title , i ){
                        if( title == me.nodeField ){
                            var val = row[i];
                            if( !_.isArray( val ) ){
                                val = [ val ];
                            };
                            obj.sets = val;
                        } else if( title == me.valueField ){
                            obj.size   = row[i];
                        } else if( title == me.labelField ){
                            obj.label   = row[i];
                        } else {
                            obj[title] = row[i];
                        }
                    } );
                    data.push( obj )
                } );
                debugger
                return data
            },
            draw : function(){
                this.stageTip = new Canvax.Display.Sprite({
                    id      : 'tip'
                });
                this.core     = new Canvax.Display.Sprite({
                    id      : 'core'
                });
    
                this.stage.addChild( this.core );
                this.stage.addChild( this.stageTip );

                this._initModule();

                this._startDraw();

                this._drawEnd();
            },
            _initModule : function(){
                this._tip    = new Tip(this.tips, this.canvax.getDomContainer());
                this._tip._getDefaultContent = this._getTipDefaultContent;
            },
            _getColor : function( color , i , name ){
                if( _.isString( color ) ){
                    return color;
                }
                if( _.isArray( color ) ){
                    return color[i]
                }
                if( _.isFunction( color ) ){
                    var c = color.apply( this , [ i , name ] );
                    if( c ){
                        return c;
                    }
                }
                return this.colors[ i ]
            },
            _getValue : function( name ){
                var val = null;
                _.each( this.data , function( obj ){
                    if( obj.sets.length == 1 && obj.sets[0] == name ){
                        val = obj.size;
                    }
                } );
                return val
            },
            getLabel : function( name ){
                var label = null;
                _.each( this.data , function( obj ){
                    if( obj.sets.join(",") == name && obj.label ){
                        label = obj.label;
                    }
                } );
                return label
            },
            _startDraw : function(){
                var me = this;

                (function(venn) {
                    "use strict";
                    venn.VennDiagram = function() {
                        var orientation = Math.PI / 2;
                        var normalize = true;
                        var solution = Venn.venn( me.data );
                        if (normalize) {
                            solution = Venn.normalizeSolution(solution, orientation);
                        };
                        var circles = Venn.scaleSolution(solution, me.width, me.height, me.padding);
                        var textCentres = computeTextCentres(circles, me.data);
                        var i = 0;
                        for( var c in circles ){
                            var obj         = circles[c];
                            var fillStyle   = Color.colorRgb( me._getColor( me.circle.fillStyle , i , c ) );
                            var strokeStyle = me._getColor( me.circle.strokeStyle , i , c ) ;
                            var circle = new Circle({
                                context : {
                                    x : obj.x,
                                    y : obj.y,
                                    r : obj.radius,
                                    fillStyle   : fillStyle.replace(")",","+me.circle.fillAlpha+")").replace("RGB","RGBA"),
                                    strokeStyle : strokeStyle,
                                    lineWidth   : me.circle.lineWidth
                                }
                            });
                            circle.index = i;
                            circle.name   = c;
                            me.core.addChild(circle);

                            circle.hover(function(e){
                                var fillStyle   = Color.colorRgb(
                                    me._getColor( me.circle.fillStyle , this.index , this.name ) 
                                );
                                var s = fillStyle.replace(")",","+(me.circle.fillAlpha+0.1)+")").replace("RGB","RGBA");
                                this.context.fillStyle = s;

                                e.tipsInfo = me._getInfoHandler( this , e );
                                me._tip.show( e );
                            } , function(e){
                                var fillStyle   = Color.colorRgb( 
                                    me._getColor( me.circle.fillStyle , this.index , this.name ) 
                                );
                                var s = fillStyle.replace(")",","+me.circle.fillAlpha+")").replace("RGB","RGBA");
                                this.context.fillStyle = s;
                                me._tip.hide( e );
                            });
                            circle.on("mousemove" , function(e){
                                e.tipsInfo = me._getInfoHandler( this , e );
                                me._tip.move( e );
                            });
                            i++;
                        };
                        i = 0;
                        for( var t in textCentres ){
                            if( t.indexOf(",") < 0 ){
                                var txtObj  = textCentres[t];
                                var content = me.getLabel(t) || t;
                                
                                var fillStyle = me._getColor( me.text.fillStyle , i , t ) ;
                                var text = new Canvax.Display.Text( content , {
                                    context : {
                                        x : txtObj.x,
                                        y : txtObj.y,
                                        fillStyle    : fillStyle,
                                        fontSize     : me.text.fontSize,
                                        textAlign    : me.text.textAlign,
                                        textBaseline : me.text.textBaseline
                                    }
                                } );
                                me.core.addChild(text);
                            }
                            i++;
                        }
                    };

                    function circleMargin(current, interior, exterior) {
                        var margin = interior[0].radius - venn.distance(interior[0], current), i, m;
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
                        var points = [], i;
                        for (i = 0; i < interior.length; ++i) {
                            var c = interior[i];
                            points.push({x: c.x, y: c.y});
                            points.push({x: c.x + c.radius/2, y: c.y});
                            points.push({x: c.x - c.radius/2, y: c.y});
                            points.push({x: c.x, y: c.y + c.radius/2});
                            points.push({x: c.x, y: c.y - c.radius/2});
                        }
                        var initial = points[0], margin = circleMargin(points[0], interior, exterior);
                        for (i = 1; i < points.length; ++i) {
                            var m = circleMargin(points[i], interior, exterior);
                            if (m >= margin) {
                                initial = points[i];
                                margin = m;
                            }
                        }

                        // maximize the margin numerically
                        var solution = venn.fmin(
                                function(p) { return -1 * circleMargin({x: p[0], y: p[1]}, interior, exterior); },
                                [initial.x, initial.y],
                                {maxIterations:500, minErrorDelta:1e-10}).solution;
                        var ret = {x: solution[0], y: solution[1]};

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
                                ret = {x: interior[0].x, y: interior[0].y};
                            } else {
                                var areaStats = {};
                                venn.intersectionArea(interior, areaStats);

                                if (areaStats.arcs.length === 0) {
                                    ret = {'x': 0, 'y': -1000, disjoint:true};
                                } else {
                                    // take average of all the points in the intersection
                                    // polygon
                                    ret = venn.getCenter(areaStats.arcs.map(function (a) { return a.p1; }));
                                }
                            }
                        }

                        return ret;
                    }
                    venn.computeTextCentre = computeTextCentre;

                    function computeTextCentres(circles, areas) {
                        var ret = {};
                        for (var i = 0; i < areas.length; ++i) {
                            var area = areas[i].sets, areaids = {};
                            for (var j = 0; j < area.length; ++j) {
                                areaids[area[j]] = true;
                            }

                            var interior = [], exterior = [];
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
                                console.log("WARNING: area " + area + " not represented on screen");
                            }
                        }
                        return  ret;
                    }
                    venn.computeTextCentres = computeTextCentres;

                })(Venn);

                Venn.VennDiagram()
                
            },
            _getTipDefaultContent: function (info) {
                return "<div style='color:#ffffff'><div style='padding-bottom:3px;'>" + info.name + "：" + info.value + "</div></div>";
            },
            _getInfoHandler:function( target ){
                var node = {
                    iNode         : target.index,
                    name          : target.name,
                    value         : this._getValue(target.name),
                    fillStyle     : target.context.strokeStyle
                };
                return node
            },
            _drawEnd : function(){
                this.stageTip.addChild(this._tip.sprite);
            }
        });
    }
)
