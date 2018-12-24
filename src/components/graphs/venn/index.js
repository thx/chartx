import Canvax from "canvax"
import GraphsBase from "../index"

import {venn, lossFunction, normalizeSolution, scaleSolution} from "../../../layout/venn/layout";
import {intersectionArea, distance, getCenter} from "../../../layout/venn/circleintersection";
import {nelderMead} from "fmin";
import { _, event } from "mmvis"

const Text = Canvax.Display.Text;
const Path = Canvax.Shapes.Path;
const Circle = Canvax.Shapes.Circle;

export default class VennGraphs extends GraphsBase
{
    constructor(opt, app)
    {
        super( opt, app );

        this.type = "venn";

        //this.field = null;
        this.keyField = null;
        this.valueField = null;

        //坚持一个数据节点的设置都在一个node下面
        this.node = {
            //field : null, //node的id标识,而不是label

            strokeStyle: null,
            lineWidth : 2,
            lineAlpha : 0,
            fillStyle : null,
            fillAlpha : 0.25,

            focus : {
                enabled : true,
                lineAlpha : 0.3
            },
            select : {
                enabled : true,
                lineWidth : 2,
                strokeStyle : "#666"
            }
        };

        this.label = {
            field      : null,
            fontSize   : 14,
            //fontFamily : "Impact",
            fontColor  : null, //"#666",
            fontWeight : "normal",
            showInter  : true
        };

        this.vennData = null;

        _.extend( true, this , opt );

        //_trimGraphs后，计算出来本次data的一些属性
        this._dataCircleLen = 0;
        this._dataLabelLen = 0;
        this._dataPathLen = 0;

        this.init( );
    }

    init()
    {

        this.venn_circles = new Canvax.Display.Sprite({ 
            id : "venn_circles"
        });
        this.sprite.addChild(this.venn_circles);

        this.venn_paths = new Canvax.Display.Sprite({ 
            id : "venn_paths"
        });
        this.sprite.addChild(this.venn_paths);

        this.venn_labels = new Canvax.Display.Sprite({ 
            id : "venn_labels"
        });
        this.sprite.addChild(this.venn_labels);
    }

    draw( opt )
    {
        !opt && (opt ={});
        _.extend( true, this , opt );
        this.data = this._trimGraphs();

        this._widget();
        
        this.sprite.context.x = this.app.padding.left;
        this.sprite.context.y = this.app.padding.top;

        this.fire("complete");
    }

    resetData( dataFrame , dataTrigger )
    {
        this.dataFrame = dataFrame;
        this.data = this._trimGraphs(); 
        this._widget();
    }

    _trimGraphs(){
        let me = this;
        let data = me._vennData();
        let layoutFunction = venn;
        let loss = lossFunction;
        let orientation = Math.PI / 2;
        let orientationOrder = null;
        let normalize = true;

        var circles = {};
        var textCentres = {};

        this._dataCircleLen = 0;
        this._dataLabelLen = 0;
        this._dataPathLen = 0;

        if (data.length > 0) {
            var solution = layoutFunction(data, {lossFunction: loss});

            if (normalize) {
                solution = normalizeSolution(solution, orientation, orientationOrder);
            };

            //第4个参数本是padding，但是这里的width,height已经是减去过padding的
            //所以就传0
            circles = scaleSolution(solution, this.width, this.height, 0); 
            textCentres = computeTextCentres(circles, data);
        };

        var circleInd = 0;
        var pathInd = 0;
        _.each( data , function(d , ind) {
            if( d.label ){
                if( d.sets.length > 1 && !me.label.showInter ){
                    //不显示path的文本
                    // ...
                } else {
                    d.labelPosition = textCentres[ d.nodeId ];
                    me._dataLabelLen++;
                }
            };
            if (d.sets.length > 1) {
                var _path = intersectionAreaPath( d.sets.map(function (set) { return circles[set]; }) );
                d.shape = {
                    type : 'path',
                    path : _path,
                    pathInd : pathInd++
                };
                me._dataPathLen++;
            } else if( d.sets.length == 1 ) {
                d.shape = _.extend( {
                    type : 'circle',
                    circleInd : circleInd++
                } , circles[ d.nodeId ] );
                me._dataCircleLen++;
            }
        });

        return data;
    }

    _vennData() {
        let data = [];
        let me = this;

        for( var i=0,l=this.dataFrame.length; i< l; i++ ){
            var rowData = me.dataFrame.getRowDataAt( i );

            let obj = {
                iNode: i,
                nodeId : null,
                rowData : rowData,
                sets : null,

                //size和value是同一个值，size是 vennLayout 需要用到的属性
                //value是 chartx中和其他图表的值属性保持统一，比如tips中就会读取value
                size : null,
                value: null,

                //这两个在绘制的时候赋值
                fillStyle: null,
                strokeStyle: null,
                
                label: null,
                labelPosition : null,
            };

            for( var p in rowData ){

                var val = rowData[p];

                if (p == me.keyField) {
                    if (!_.isArray(val)) {
                        val = val.split(/[,|]/);
                    };
                    obj.sets = val;
                    obj.nodeId = val.join();
                } else if (p == me.valueField) {
                    obj.size = val;
                    obj.value = val; 
                } else if (p == me.label.field) {
                    obj.label = val;
                };
            }

            data.push(obj);

        };

        return data;
    }

    _getStyle( style, ind, nodeData, defColor ){
        var color;
        if( _.isString( style ) ){
            color = style;
        }
        if( _.isFunction( style ) ){
            color = style( nodeData );
        }
        if( !color && ind != undefined ){
            color = this.app.getTheme( ind );
        }
        if( !color && defColor != undefined ){
            color = defColor;
        }
        return color;
    }

    _widget(){
        var me = this;

        //那么有多余的元素要去除掉 begin
        if( me.venn_circles.children.length > me._dataCircleLen ){
            for( var i=me._dataCircleLen; i<me.venn_circles.children.length; i++ ){
                me.venn_circles.getChildAt( i-- ).destroy();
            }
        };
        if( me.venn_paths.children.length > me._dataPathLen ){
            for( var i=me._dataPathLen; i<me.venn_paths.children.length; i++ ){
                me.venn_paths.getChildAt( i-- ).destroy();
            }
        };
        if( me.venn_labels.children.length > me._dataLabelLen ){
            for( var i=me._dataLabelLen; i<me.venn_labels.children.length; i++ ){
                me.venn_labels.getChildAt( i-- ).destroy();
            }
        };
        //那么有多余的元素要去除掉 end

        let circleInd = 0;
        let pathInd = 0;
        let labelInd = 0;
        _.each( this.data , function( nodeData, i ){
            var shape = nodeData.shape;
            var _shape;
            var isNewShape = true;
            if( shape ){
                var context;
                if( shape.type == 'circle' ){
                    var fillStyle = me._getStyle( me.node.fillStyle , shape.circleInd, nodeData );
                    var strokeStyle = me._getStyle( me.node.strokeStyle, shape.circleInd, nodeData );
                    
                    nodeData.fillStyle = fillStyle;
                    nodeData.strokeStyle = strokeStyle;

                    context = {
                        x : shape.x,
                        y : shape.y,
                        r : shape.radius,
                        fillStyle : fillStyle,
                        fillAlpha : me.node.fillAlpha,
                        lineWidth : me.node.lineWidth,
                        strokeStyle : strokeStyle,
                        lineAlpha : me.node.lineAlpha
                    };
                    _shape = me.venn_circles.getChildAt( circleInd++ );
                    if( !_shape ){
                        _shape = new Circle({
                            pointChkPriority : false,
                            hoverClone: false,
                            context : context
                        });
                        me.venn_circles.addChild(_shape);
                    } else {
                        isNewShape = false;
                        _shape.animate( context )
                    }

                };
                if( nodeData.shape.type == 'path' ){
                    context = {
                        path : shape.path,
                        fillStyle : "#ffffff",
                        fillAlpha : 0,//me.node.fillAlpha,
                        lineWidth : me.node.lineWidth,
                        strokeStyle : "#ffffff",
                        lineAlpha : 0//me.node.lineAlpha
                    };
                    
                    _shape = me.venn_paths.getChildAt( pathInd++ );
                    if( !_shape ){
                        _shape = new Path({
                            pointChkPriority:false,
                            context : context
                        });
                        me.venn_paths.addChild(_shape);
                    } else {
                        isNewShape = false;
                        _shape.context.path = shape.path;
                        //_shape.animate( context )
                    }
                    
                };


                _shape.nodeData = nodeData;
                nodeData._node = _shape;

                me.node.focus.enabled && _shape.hover(function(e){
                    me.focusAt( this.nodeData.iNode );
                } , function(e){
                    !this.nodeData.selected && me.unfocusAt( this.nodeData.iNode );
                });

                //新创建的元素才需要绑定事件，因为复用的原件已经绑定过事件了
                if( isNewShape ){
                    _shape.on( event.types.get(), function(e) {
                        
                        e.eventInfo = {
                            trigger : me.node,
                            title : null,
                            nodes : [ this.nodeData ]
                        };
        
                        //fire到root上面去的是为了让root去处理tips
                        me.app.fire( e.type, e );
                    });
                };

            }

            if( nodeData.label && me.label.enabled ){
            
                var fontColor = me._getStyle( me.label.fontColor, shape.circleInd, nodeData , "#999");
                var fontSize = me.label.fontSize;
                if( nodeData.sets.length > 1 ){
                    if( !me.label.showInter ){
                        fontSize = 0;
                    } else {
                        fontSize -= 2;
                    }
                };
                
                if( fontSize ){
                    var _textContext = {
                        x : nodeData.labelPosition.x,
                        y : nodeData.labelPosition.y,
                        fontSize: fontSize,
                        //fontFamily: me.label.fontFamily,
                        textBaseline: "middle",
                        textAlign: "center",
                        fontWeight: me.label.fontWeight,
                        fillStyle: fontColor
                    };

                    var _txt = me.venn_labels.getChildAt( labelInd++ );
                    if( !_txt ){
                        _txt = new Text( nodeData.label, {
                            context : _textContext
                        } );
                        me.venn_labels.addChild( _txt );
                    } else {
                        _txt.resetText( nodeData.label );
                        _txt.animate( _textContext );
                    }
                    
                }
            }
        });
    }




    focusAt( ind ){
        let nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || nodeData.focused ) return;

        let nctx = nodeData._node.context; 
        //nctx.lineAlpha += 0.5;
        if( nodeData.sets.length>1 ){
            //path
            nctx.lineAlpha = 1;
        } else {
            //circle
            nctx.lineAlpha = this.node.focus.lineAlpha;
        }
        
        nodeData.focused = true;
    }
    
    unfocusAt( ind ){
        let nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || !nodeData.focused ) return;
        let nctx = nodeData._node.context; 
        //nctx.lineAlpha = 0.5;
        nctx.lineAlpha = this.node.lineAlpha;
        nodeData.focused = false;
    }
    
    selectAt( ind ){
        
        let nodeData = this.data[ ind ];
        if( !this.node.select.enabled || nodeData.selected ) return;

        let nctx = nodeData._node.context; 
        nctx.lineWidth = this.node.select.lineWidth;
        nctx.lineAlpha = this.node.select.lineAlpha;
        nctx.strokeStyle = this.node.select.strokeStyle;

        nodeData.selected = true;
    }

    unselectAt( ind ){
        let nodeData = this.data[ ind ];
        if( !this.node.select.enabled || !nodeData.selected ) return;
        let nctx = nodeData._node.context; 
        nctx.strokeStyle = this.node.strokeStyle;

        nodeData.selected = false;
    }

}


//venn computeTextCentres 需要的相关代码 begin
function getOverlappingCircles(circles) {
    var ret = {}, circleids = [];
    for (var circleid in circles) {
        circleids.push(circleid);
        ret[circleid] = [];
    }
    for (var i  = 0; i < circleids.length; i++) {
        var a = circles[circleids[i]];
        for (var j = i + 1; j < circleids.length; ++j) {
            var b = circles[circleids[j]],
                d = distance(a, b);

            if (d + b.radius <= a.radius + 1e-10) {
                ret[circleids[j]].push(circleids[i]);

            } else if (d + a.radius <= b.radius + 1e-10) {
                ret[circleids[i]].push(circleids[j]);
            }
        }
    }
    return ret;
}

function computeTextCentres(circles, areas) {
    var ret = {}, overlapped = getOverlappingCircles(circles);
    for (var i = 0; i < areas.length; ++i) {
        var area = areas[i].sets, areaids = {}, exclude = {};
        for (var j = 0; j < area.length; ++j) {
            areaids[area[j]] = true;
            var overlaps = overlapped[area[j]];
            for (var k = 0; k < overlaps.length; ++k) {
                exclude[overlaps[k]] = true;
            }
        }

        var interior = [], exterior = [];
        for (var setid in circles) {
            if (setid in areaids) {
                interior.push(circles[setid]);
            } else if (!(setid in exclude)) {
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
function computeTextCentre(interior, exterior) {
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
    var solution = nelderMead(
                function(p) { return -1 * circleMargin({x: p[0], y: p[1]}, interior, exterior); },
                [initial.x, initial.y],
                {maxIterations:500, minErrorDelta:1e-10}).x;
    var ret = {x: solution[0], y: solution[1]};

    // check solution, fallback as needed (happens if fully overlapped
    // etc)
    var valid = true;
    for (i = 0; i < interior.length; ++i) {
        if (distance(ret, interior[i]) > interior[i].radius) {
            valid = false;
            break;
        }
    }

    for (i = 0; i < exterior.length; ++i) {
        if (distance(ret, exterior[i]) < exterior[i].radius) {
            valid = false;
            break;
        }
    }

    if (!valid) {
        if (interior.length == 1) {
            ret = {x: interior[0].x, y: interior[0].y};
        } else {
            var areaStats = {};
            intersectionArea(interior, areaStats);

            if (areaStats.arcs.length === 0) {
                ret = {'x': 0, 'y': -1000, disjoint:true};

            } else if (areaStats.arcs.length == 1) {
                ret = {'x': areaStats.arcs[0].circle.x,
                       'y': areaStats.arcs[0].circle.y};

            } else if (exterior.length) {
                // try again without other circles
                ret = computeTextCentre(interior, []);

            } else {
                // take average of all the points in the intersection
                // polygon. this should basically never happen
                // and has some issues:
                // https://github.com/benfred/venn.js/issues/48#issuecomment-146069777
                ret = getCenter(areaStats.arcs.map(function (a) { return a.p1; }));
            }
        }
    }

    return ret;
}

function circleMargin(current, interior, exterior) {
    var margin = interior[0].radius - distance(interior[0], current), i, m;
    for (i = 1; i < interior.length; ++i) {
        m = interior[i].radius - distance(interior[i], current);
        if (m <= margin) {
            margin = m;
        }
    }

    for (i = 0; i < exterior.length; ++i) {
        m = distance(exterior[i], current) - exterior[i].radius;
        if (m <= margin) {
            margin = m;
        }
    }
    return margin;
}

function circlePath(x, y, r) {
    var ret = [];
    ret.push("\nM", x, y);
    ret.push("\nm", -r, 0);
    ret.push("\na", r, r, 0, 1, 0, r *2, 0);
    ret.push("\na", r, r, 0, 1, 0,-r *2, 0);
    return ret.join(" ");
}

/** returns a svg path of the intersection area of a bunch of circles */
function intersectionAreaPath(circles) {
    var stats = {};
    intersectionArea(circles, stats);
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
            var arc = arcs[i], r = arc.circle.radius, wide = arc.width > r;
            ret.push("\nA", r, r, 0, wide ? 1 : 0, 1,
                     arc.p1.x, arc.p1.y);
        }
        return ret.join(" ")+" z";
    }
}

//venn computeTextCentres 需要的相关代码 end