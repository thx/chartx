import Canvax from "canvax"
import GraphsBase from "../index"

import {venn, lossFunction, normalizeSolution, scaleSolution} from "../../../layout/venn/layout";
import {intersectionArea, distance, getCenter} from "../../../layout/venn/circleintersection";
import {nelderMead} from "fmin";
import {getDefaultProps} from "../../../utils/tools"

let { _, event } = Canvax;
let Text = Canvax.Display.Text;
let Path = Canvax.Shapes.Path;
let Circle = Canvax.Shapes.Circle;

class VennGraphs extends GraphsBase
{
    static defaultProps(){
        return {
            keyField: {
                detail: 'key字段',
                default: 'name'
            },
            valueField: {
                detail: 'value字段',
                default: 'value'
            },
            node: {
                detail: '单个节点配置',
                propertys: {
                    strokeStyle: {
                        detail: '边框颜色',
                        default: null
                    },
                    lineWidth: {
                        detail: '边框大小',
                        default: 2
                    },
                    strokeAlpha: {
                        detail: '边框透明度',
                        default: 0
                    },
                    fillStyle: {
                        detail: '背景色',
                        default: null
                    },
                    fillAlpha: {
                        detail: '背景透明度',
                        default: 0.25
                    },
                    focus: {
                        detail: 'hover设置',
                        propertys: {
                            enabled: {
                                detail: '是否开启',
                                default:true
                            },
                            strokeAlpha: {
                                detail: '边框透明度',
                                default: 0.3
                            }
                        }
                    },
                    select: {
                        detail: '选中设置',
                        propertys: {
                            enabled: {
                                detail: '是否开启',
                                default:true
                            },
                            lineWidth: {
                                detail: '描边宽度',
                                default: 2
                            },
                            strokeStyle: {
                                detail: '描边颜色',
                                default: '#666666'
                            }
                        }
                    }
                }
            },
            label: {
                detail: '文本设置',
                propertys: {
                    field: {
                        detail: '获取文本的字段',
                        default: null
                    },
                    fontSize: {
                        detail: '字体大小',
                        default: 14
                    },
                    fontColor: {
                        detail: '文本颜色',
                        default: null
                    },
                    fontWeight: {
                        detail: 'fontWeight',
                        default: 'normal'
                    },
                    showInter: {
                        detail: '是否显示相交部分的文本',
                        default:true
                    }
                }
            }
        }
    }

    constructor(opt, app)
    {
        super( opt, app );
        this.type = "venn";

        this.vennData = null;

        _.extend( true, this , getDefaultProps( VennGraphs.defaultProps() ), opt );

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

    resetData( dataFrame )
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

        let circles = {};
        let textCentres = {};

        this._dataCircleLen = 0;
        this._dataLabelLen = 0;
        this._dataPathLen = 0;

        if (data.length > 0) {
            let solution = layoutFunction(data, {lossFunction: loss});

            if (normalize) {
                solution = normalizeSolution(solution, orientation, orientationOrder);
            };

            //第4个参数本是padding，但是这里的width,height已经是减去过padding的
            //所以就传0
            circles = scaleSolution(solution, this.width, this.height, 0); 
            textCentres = computeTextCentres(circles, data);
        };

        let circleInd = 0;
        let pathInd = 0;
        _.each( data , function(d) {
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
                let _path = intersectionAreaPath( d.sets.map(function (set) { return circles[set]; }) );
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

        for( let i=0,l=this.dataFrame.length; i< l; i++ ){
            let rowData = me.dataFrame.getRowDataAt( i );

            let obj = {
                type : "venn",
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

            for( let p in rowData ){

                let val = rowData[p];

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
        let color;
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
        let me = this;

        //那么有多余的元素要去除掉 begin
        if( me.venn_circles.children.length > me._dataCircleLen ){
            for( let i=me._dataCircleLen; i<me.venn_circles.children.length; i++ ){
                me.venn_circles.getChildAt( i-- ).destroy();
            }
        };
        if( me.venn_paths.children.length > me._dataPathLen ){
            for( let i=me._dataPathLen; i<me.venn_paths.children.length; i++ ){
                me.venn_paths.getChildAt( i-- ).destroy();
            }
        };
        if( me.venn_labels.children.length > me._dataLabelLen ){
            for( let i=me._dataLabelLen; i<me.venn_labels.children.length; i++ ){
                me.venn_labels.getChildAt( i-- ).destroy();
            }
        };
        //那么有多余的元素要去除掉 end

        let circleInd = 0;
        let pathInd = 0;
        let labelInd = 0;
        _.each( this.data , function( nodeData ){
            let shape = nodeData.shape;
            let _shape;
            let isNewShape = true;
            if( shape ){
                let context;
                if( shape.type == 'circle' ){
                    let fillStyle = me._getStyle( me.node.fillStyle , shape.circleInd, nodeData );
                    let strokeStyle = me._getStyle( me.node.strokeStyle, shape.circleInd, nodeData );
                    
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
                        strokeAlpha : me.node.strokeAlpha
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
                        strokeAlpha : 0//me.node.strokeAlpha
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

                me.node.focus.enabled && _shape.hover(function(){
                    me.focusAt( this.nodeData.iNode );
                } , function(){
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
            
                let fontColor = me._getStyle( me.label.fontColor, shape.circleInd, nodeData , "#999");
                let fontSize = me.label.fontSize;
                if( nodeData.sets.length > 1 ){
                    if( !me.label.showInter ){
                        fontSize = 0;
                    } else {
                        fontSize -= 2;
                    }
                };
                
                if( fontSize ){
                    let _textContext = {
                        x : nodeData.labelPosition.x,
                        y : nodeData.labelPosition.y,
                        fontSize: fontSize,
                        //fontFamily: me.label.fontFamily,
                        textBaseline: "middle",
                        textAlign: "center",
                        fontWeight: me.label.fontWeight,
                        fillStyle: fontColor
                    };

                    let _txt = me.venn_labels.getChildAt( labelInd++ );
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
        //nctx.strokeAlpha += 0.5;
        if( nodeData.sets.length>1 ){
            //path
            nctx.strokeAlpha = 1;
        } else {
            //circle
            nctx.strokeAlpha = this.node.focus.strokeAlpha;
        }
        
        nodeData.focused = true;
    }
    
    unfocusAt( ind ){
        let nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || !nodeData.focused ) return;
        let nctx = nodeData._node.context; 
        //nctx.strokeAlpha = 0.5;
        nctx.strokeAlpha = this.node.strokeAlpha;
        nodeData.focused = false;
    }
    
    selectAt( ind ){
        
        let nodeData = this.data[ ind ];
        if( !this.node.select.enabled || nodeData.selected ) return;

        let nctx = nodeData._node.context; 
        nctx.lineWidth = this.node.select.lineWidth;
        nctx.strokeAlpha = this.node.select.strokeAlpha;
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
    let ret = {}, circleids = [];
    for (let circleid in circles) {
        circleids.push(circleid);
        ret[circleid] = [];
    }
    for (let i  = 0; i < circleids.length; i++) {
        let a = circles[circleids[i]];
        for (let j = i + 1; j < circleids.length; ++j) {
            let b = circles[circleids[j]],
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
    let ret = {}, overlapped = getOverlappingCircles(circles);
    for (let i = 0; i < areas.length; ++i) {
        let area = areas[i].sets, areaids = {}, exclude = {};
        for (let j = 0; j < area.length; ++j) {
            areaids[area[j]] = true;
            let overlaps = overlapped[area[j]];
            for (let k = 0; k < overlaps.length; ++k) {
                exclude[overlaps[k]] = true;
            }
        }

        let interior = [], exterior = [];
        for (let setid in circles) {
            if (setid in areaids) {
                interior.push(circles[setid]);
            } else if (!(setid in exclude)) {
                exterior.push(circles[setid]);
            }
        }
        let centre = computeTextCentre(interior, exterior);
        ret[area] = centre;
        if (centre.disjoint && (areas[i].size > 0)) {
            console.log("WARNING: area " + area + " not represented on screen");
        }
    }
    return  ret;
}
function computeTextCentre(interior, exterior) {
    let points = [], i;
    for (i = 0; i < interior.length; ++i) {
        let c = interior[i];
        points.push({x: c.x, y: c.y});
        points.push({x: c.x + c.radius/2, y: c.y});
        points.push({x: c.x - c.radius/2, y: c.y});
        points.push({x: c.x, y: c.y + c.radius/2});
        points.push({x: c.x, y: c.y - c.radius/2});
    }
    let initial = points[0], margin = circleMargin(points[0], interior, exterior);
    for (i = 1; i < points.length; ++i) {
        let m = circleMargin(points[i], interior, exterior);
        if (m >= margin) {
            initial = points[i];
            margin = m;
        }
    }

    // maximize the margin numerically
    let solution = nelderMead(
                function(p) { return -1 * circleMargin({x: p[0], y: p[1]}, interior, exterior); },
                [initial.x, initial.y],
                {maxIterations:500, minErrorDelta:1e-10}).x;
    let ret = {x: solution[0], y: solution[1]};

    // check solution, fallback as needed (happens if fully overlapped
    // etc)
    let valid = true;
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
            let areaStats = {};
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
    let margin = interior[0].radius - distance(interior[0], current), i, m;
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
    let ret = [];
    ret.push("\nM", x, y);
    ret.push("\nm", -r, 0);
    ret.push("\na", r, r, 0, 1, 0, r *2, 0);
    ret.push("\na", r, r, 0, 1, 0,-r *2, 0);
    return ret.join(" ");
}

/** returns a svg path of the intersection area of a bunch of circles */
function intersectionAreaPath(circles) {
    let stats = {};
    intersectionArea(circles, stats);
    let arcs = stats.arcs;

    if (arcs.length === 0) {
        return "M 0 0";

    } else if (arcs.length == 1) {
        let circle = arcs[0].circle;
        return circlePath(circle.x, circle.y, circle.radius);

    } else {
        // draw path around arcs
        let ret = ["\nM", arcs[0].p2.x, arcs[0].p2.y];
        for (let i = 0; i < arcs.length; ++i) {
            let arc = arcs[i], r = arc.circle.radius, wide = arc.width > r;
            ret.push("\nA", r, r, 0, wide ? 1 : 0, 1,
                     arc.p1.x, arc.p1.y);
        }
        return ret.join(" ")+" z";
    }
}

//venn computeTextCentres 需要的相关代码 end


GraphsBase.registerComponent( VennGraphs, 'graphs', 'venn' );

export default VennGraphs;