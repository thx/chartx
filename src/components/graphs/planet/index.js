import Canvax from "canvax"
import GraphsBase from "../index"
import Group from "./group"
import { global,dataFrame,_,getDefaultProps,event } from "mmvis"

const Text = Canvax.Display.Text;
const Circle = Canvax.Shapes.Circle;
const Line = Canvax.Shapes.Line;
const Rect = Canvax.Shapes.Rect;
const Sector = Canvax.Shapes.Sector;

class PlanetGraphs extends GraphsBase
{
    static defaultProps(){
        return {
            field: {
                detail : '字段设置',
                default: null
            },
            center: {
                detail: '中心点设置',
                propertys : {
                    enabled: {
                        detail: '是否显示中心',
                        default: true
                    },
                    text : {
                        detail: '中心区域文本',
                        default: 'center'
                    },
                    radius: {
                        detail: '中心圆半径',
                        default: 30
                    },
                    fillStyle: {
                        detail: '中心背景色',
                        default: '#70629e'
                    },
                    fontSize: {
                        detail: '中心字体大小',
                        default: 15
                    },
                    fontColor: {
                        detail: '中心字体颜色',
                        default: '#ffffff'
                    },
                    margin : {
                        detail: '中区区域和外围可绘图区域距离',
                        default: 20
                    },
                    cursor : {
                        detail: '中心节点的鼠标手势',
                        default: 'default'
                    }
                }
            },
            selectInds: {
                detail: '选中的数据索引',
                default: []
            },
            grid: {
                detail: '星系图自己的grid',
                propertys: {
                    rings: {
                        detail: '环配置',
                        propertys: {
                            fillStyle: {
                                detail: '背景色',
                                default: null
                            },
                            strokeStyle: {
                                detail: '环线色',
                                default: null
                            },
                            lineWidth: {
                                detail: '环线宽',
                                default: 1
                            },
                            count: {
                                detail: '分几环',
                                default: 3
                            }
                        }
                    },
                    rays: {
                        detail: '射线配置',
                        propertys: {
                            count: {
                                detail: '射线数量',
                                default: 0
                            },
                            globalAlpha: {
                                detail: '线透明度',
                                default: 0.4
                            },
                            strokeStyle: {
                                detail: '线色',
                                default: '#10519D'
                            },
                            lineWidth: {
                                detail: '线宽',
                                default: 1
                            }
                        }
                    }
                }
            },
            
            bewrite: {
                detail : 'planet的趋势描述',
                propertys: {
                    enabled: {
                        detail: '是否开启趋势描述',
                        default: false
                    },
                    text : {
                        detail: '描述文本',
                        default: null
                    },
                    fontColor: {
                        detail: 'fontColor',
                        default: '#999'
                    },
                    fontSize: {
                        detail: 'fontSize',
                        default: 12
                    }
                }
            },

            scan : {
                detail : '扫描效果',
                propertys: {
                    enabled: {
                        detail: '是否开启扫描效果',
                        default: false
                    },
                    fillStyle: {
                        detail: '扫描效果颜色',
                        default: null //默认取 me._graphs.center.fillStyle
                    },
                    alpha: {
                        detail: '起始透明度',
                        default: 0.6
                    },
                    angle: {
                        detail: '扫描效果的覆盖角度',
                        default: 90
                    },
                    r : {
                        detail: '扫描效果覆盖的半径',
                        default: null
                    },
                    repeat : {
                        detail: '扫描次数',
                        default: 3
                    }
                }
            },

            _props : [
                Group
            ]
        }
    }
    constructor(opt, app)
    {
        super( opt, app );

        this.type = "planet";

        this.groupDataFrames = [];
        this.groupField = null;
        this._ringGroups = []; //groupField对应的 group 对象

        //planet自己得grid，不用polar的grid
        this.grid = {
            rings : {
                _section: []
            }
        };

        _.extend( true, this , getDefaultProps( PlanetGraphs.defaultProps() ), opt );

        if( this.center.radius == 0 || !this.center.enabled ){
            this.center.radius = 0;
            this.center.margin = 0;
            this.center.enabled = false;
        };

        this.__scanIngCurOration = 0;

        this.init();
    }
    
    init()
    {
        this.gridSp = new Canvax.Display.Sprite({ 
            id : "gridSp"
        });
        this.groupSp = new Canvax.Display.Sprite({ 
            id : "groupSp"
        });
        this.scanSp = new Canvax.Display.Sprite({ 
            id : "scanSp"
        });
        this.centerSp = new Canvax.Display.Sprite({ 
            id : "centerSp"
        });

        this.sprite.addChild( this.gridSp );
        this.sprite.addChild( this.groupSp );
        this.sprite.addChild( this.scanSp );
        this.sprite.addChild( this.centerSp );
        
    }

    draw( opt )
    {
        
        !opt && (opt ={});
        _.extend( true, this , opt );

        this._dataGroupHandle();

        this._drawGroups();

        this._drawBack();

        this._drawBewrite();

        this._drawCenter();

        this._drawScan();

        this.fire("complete");
    
    }
    

    _getMaxR()
    {
        var _circleMaxR;
        try{
            _circleMaxR = this.graphs.group.circle.maxRadius;
        } catch(e){}
        if( _circleMaxR == undefined ){
            _circleMaxR = 30
        };
        return _circleMaxR;
    }

    _drawGroups()
    {
        var me = this;

        var groupRStart = this.center.radius + this.center.margin;
      
        var maxRadius = me.app.getComponent({name:'coord'}).getMaxDisToViewOfOrigin() - me.center.radius - me.center.margin;
        
        var _circleMaxR = this._getMaxR();

        _.each( this.groupDataFrames , function( df , i ){
            
            var toR = groupRStart + maxRadius*( (df.length) / (me.dataFrame.length) );
            
            var _g = new Group( _.extend(true, {
                iGroup : i,
                groupLen : me.groupDataFrames.length,
                rRange : {
                    start : groupRStart,
                    to : toR
                },
                width : me.width - _circleMaxR*2,
                height: me.height - _circleMaxR*2,
                selectInds : me.selectInds
            }, me._opt) , df , me );

            groupRStart = _g.rRange.to;

            me._ringGroups.push( _g );

            me.grid.rings._section.push({
                radius : _g.rRange.to
            });
            
        } );
        
        _.each( me._ringGroups , function(_g){
            me.sprite.addChild( _g.sprite );
        } );
    }

    _drawCenter()
    {
        var me = this;
        if( this.center.enabled ){
            //绘制中心实心圆
            this._center = new Circle({
                hoverClone:false,
                context : {
                    x : this.origin.x,
                    y : this.origin.y,
                    fillStyle : this.center.fillStyle,
                    r : this.center.radius,
                    cursor : this.center.cursor
                }
            });
            
            //绘制实心圆上面的文案
            this._centerTxt = new Text(this.center.text, {
                context: {
                    x: this.origin.x,
                    y: this.origin.y,
                    fontSize: this.center.fontSize,
                    textAlign: "center",
                    textBaseline: "middle",
                    fillStyle: this.center.fontColor
                }
            });

            //给圆点添加事件
            this._center.on( event.types.get(), function( e ){
                e.eventInfo = {
                    title : me.center.text,
                    trigger : me.center,
                    nodes : [ me.center ]
                };

                if( me.center['onclick'] ){
                    if( e.type == 'mousedown' ){
                        me._center.context.r += 2;
                    }
                    if( e.type == 'mouseup' ){
                        me._center.context.r -= 2;
                    }
                };
                
                me.app.fire( e.type, e );

            } );

            this.centerSp.addChild( this._center );
            this.centerSp.addChild( this._centerTxt );
        }
    }

    _drawBack(){
        var me = this;
        var _coord = this.app.getComponent({name:'coord'});
        
        if( me.grid.rings._section.length == 1 ){

            //如果只有一个，那么就强制添加到3个
            var _diffR = (me.grid.rings._section[0].radius - me.center.radius) / me.grid.rings.count;
            me.grid.rings._section = [];
            for( var i=0;i<me.grid.rings.count ; i++ ){
                me.grid.rings._section.push({
                    radius : me.center.radius + _diffR*(i+1)
                });
            }

        } else {
            me.grid.rings.count = me.grid.rings._section.length;
        };

        
        for( var i=me.grid.rings._section.length-1 ; i>=0 ; i-- ){
            var _scale = me.grid.rings._section[i];
            me.gridSp.addChild( new Circle({
                context : {
                    x : _coord.origin.x,
                    y : _coord.origin.y,
                    r : _scale.radius,
                    lineWidth : me._getBackProp( me.grid.rings.lineWidth , i),
                    strokeStyle : me._getBackProp( me.grid.rings.strokeStyle , i),
                    fillStyle: me._getBackProp( me.grid.rings.fillStyle , i)
                }
            }) );
        };

        
        //如果back.rays.count非0， 则绘制从圆心出发的射线
        if( me.grid.rays.count > 1 ){
            var cx = _coord.origin.x;
            var cy = _coord.origin.y;
            var itemAng = 360 / me.grid.rays.count;
            var _r = _coord.getMaxDisToViewOfOrigin(); //Math.max( me.w, me.h );

            if( me.grid.rings._section.length ){
                _r = me.grid.rings._section.slice(-1)[0].radius
            }

            for( var i=0,l=me.grid.rays.count; i<l; i++ ){
                var radian = itemAng*i / 180 * Math.PI;
                var tx = cx + _r * Math.cos( radian );
                var ty = cy + _r * Math.sin( radian );

                me.gridSp.addChild( new Line({
                    context : {
                        start : {
                            x : cx,
                            y : cy
                        },
                        end : {
                            x : tx,
                            y : ty
                        },
                        lineWidth : me._getBackProp( me.grid.rays.lineWidth , i),
                        strokeStyle : me._getBackProp( me.grid.rays.strokeStyle , i),
                        globalAlpha : me.grid.rays.globalAlpha
                    }
                }) );
            };
        };

        var _clipRect = new Rect({
            name: "clipRect",
            context : {
                x : _coord.origin.x-me.app.width/2,
                y : _coord.origin.y-me.height/2,
                width : me.app.width,
                height : me.height
            }
        });
        me.gridSp.clipTo( _clipRect );

        //TODO：理论上下面这句应该可以神略了才行
        me.sprite.addChild( _clipRect );

    }

    _getBackProp( p, i )
    {
        var iGroup = i;
        var res = null;
        if( _.isFunction( p ) ){
            res = p.apply( this , [ {
                //iGroup : iGroup,
                scaleInd : i,
                count : this.grid.rings._section.length,

                groups : this._ringGroups,
                graphs : this
            } ] );
        };
        if( _.isString( p ) || _.isNumber( p ) ){
            res = p;
        };
        if( _.isArray( p ) ){
            res = p[i]
        };
        return res
    }

    _drawBewrite(){
        var me = this;
        //如果开启了描述中线
        if( me.bewrite.enabled ){

            var _txt,_txtWidth,_powerTxt,_weakTxt;

        
            if( me.bewrite.text ){
                _txt = new Canvax.Display.Text( me.bewrite.text , {
                    context : {
                        fillStyle: me.bewrite.fontColor,
                        fontSize : me.bewrite.fontSize,
                        textBaseline: "middle",
                        textAlign: "center"
                    }
                } );
                _txtWidth = _txt.getTextWidth();
            };
            _powerTxt = new Canvax.Display.Text( "强" , {
                context : {
                    fillStyle: me.bewrite.fontColor,
                    fontSize : me.bewrite.fontSize,
                    textBaseline: "middle",
                    textAlign: "center"
                }
            } );
            _weakTxt = new Canvax.Display.Text( "弱" , {
                context : {
                    fillStyle: me.bewrite.fontColor,
                    fontSize : me.bewrite.fontSize,
                    textBaseline: "middle",
                    textAlign: "center"
                }
            } );

            var _bewriteSp = new Canvax.Display.Sprite({
                context: {
                    x : this.origin.x,
                    y : this.origin.y
                }
            });
            me.sprite.addChild(_bewriteSp);

            var _graphR = me.width/2;

            function _draw( direction, _txt, _powerTxt, _weakTxt ){
                //先绘制右边的
                _powerTxt.context.x = direction*me.center.radius + direction*20;
                _bewriteSp.addChild( _powerTxt );

                _bewriteSp.addChild( new Line({
                    context: {
                        lineType: 'dashed',
                        start: {
                            x : _powerTxt.context.x,
                            y : 0
                        },
                        end : {
                            x : direction*(_txt ? (_graphR/2-_txtWidth/2) : _graphR),
                            y : 0
                        },
                        lineWidth: 1,
                        strokeStyle : "#ccc"
                    }
                }) );
                if( _txt ){
                    _txt.context.x = direction*(_graphR/2);
                    _bewriteSp.addChild( _txt );

                    _bewriteSp.addChild( new Line({
                        context: {
                            lineType: 'dashed',
                            start: {
                                x : direction*(_graphR/2+_txtWidth/2),
                                y : 0
                            },
                            end : {
                                x : direction*_graphR,
                                y : 0
                            },
                            lineWidth: 1,
                            strokeStyle : "#ccc"
                        }
                    }) );
                };
                _weakTxt.context.x = direction*_graphR;
                _bewriteSp.addChild( _weakTxt );
            }

            _draw( 1, _txt.clone(), _powerTxt.clone(), _weakTxt.clone() );
            _draw( -1, _txt.clone(), _powerTxt.clone(), _weakTxt.clone() );
            

        };
    }

    scan(){
        var me = this;
        this._scanAnim && this._scanAnim.stop();
        var _scanSp = me._getScanSp();

        //开始动画
        if( me.__scanIngCurOration == 360 ){
            _scanSp.context.rotation = 0;
        };
        me._scanAnim = _scanSp.animate({
            rotation : 360,
            globalAlpha: 1
        },{
            duration: 1000 * ( (360-me.__scanIngCurOration)/360 ) ,
            onUpdate: function(e){
                me.__scanIngCurOration = e.rotation;
            },
            onComplete: function(){
                _scanSp.context.rotation = 0;
                me._scanAnim = _scanSp.animate({
                    rotation : 360
                }, {
                    duration: 1000,
                    repeat: 1000, //一般repeat不到1000
                    onUpdate: function(e){
                        me.__scanIngCurOration = e.rotation;
                    }
                });
            }
        });
    }

    _drawScan( callback ){
        var me = this;
        
        if( me.scan.enabled ){

            var _scanSp = me._getScanSp();

            //开始动画
            if( me.__scanIngCurOration == 360 ){
                _scanSp.context.rotation = 0;
            };
            
            me._scanAnim && me._scanAnim.stop();

            me._scanAnim = _scanSp.animate({
                rotation : 360,
                globalAlpha: 1
            },{
                duration: 1000 * ( (360-me.__scanIngCurOration)/360 ) ,
                onUpdate: function(e){
                    me.__scanIngCurOration = e.rotation;
                },
                onComplete: function(){
                    _scanSp.context.rotation = 0;
                    me._scanAnim = _scanSp.animate({
                        rotation : 360
                    }, {
                        duration: 1000,
                        repeat: me.scan.repeat - 2,
                        onUpdate: function(e){
                            me.__scanIngCurOration = e.rotation;
                        },
                        onComplete: function(){
                            _scanSp.context.rotation = 0;
                            me._scanAnim = _scanSp.animate({
                                rotation : 360,
                                globalAlpha: 0
                            }, {
                                duration: 1000,
                                onUpdate: function(e){
                                    me.__scanIngCurOration = e.rotation;
                                },
                                onComplete: function(){
                                    _scanSp.destroy();
                                    me.__scanSp = null;
                                    delete me.__scanSp;
                                    me.__scanIngCurOration = 0;

                                    callback && callback();
                                }
                            })
                        }
                    });
                }
            });
        };
    }

    _getScanSp(){
        
        var me = this;

        //先准备scan元素
        var _scanSp = me.__scanSp;

        if( !_scanSp ){
            
            _scanSp = new Canvax.Display.Sprite({
                context:{
                    x           : this.origin.x,
                    y           : this.origin.y,
                    globalAlpha : 0,
                    rotation    : me.__scanIngCurOration
                }
            });
            me.scanSp.addChild(_scanSp);
            me.__scanSp = _scanSp;

            var r = me.scan.r || me.height/2 - 10;
            var fillStyle = me.scan.fillStyle || me.center.fillStyle;

            //如果开启了扫描效果
            var count = me.scan.angle;
            for( var i=0,l=count; i<l; i++ ){
                var node = new Sector({
                    context: {
                        r: r,
                        fillStyle: fillStyle,
                        clockwise: true,
                        startAngle: 360-i,
                        endAngle: 359-i,
                        globalAlpha: me.scan.alpha - ( me.scan.alpha / count)*i
                    }
                })
                _scanSp.addChild( node );
            };
            var _line = new Line({
                context: {
                    end : {
                        x : r,
                        y : 0
                    },
                    lineWidth: 1,
                    strokeStyle : fillStyle
                }
            });
            _scanSp.addChild( _line );
        };
        //准备scan元素完毕
        return _scanSp;
    }
    
    _dataGroupHandle()
    {
        var groupFieldInd = _.indexOf(this.dataFrame.fields , this.groupField);
        if( groupFieldInd >= 0 ){
            //有分组字段，就还要对dataFrame中的数据分下组，然后给到 groupDataFrames
            var titles = this.dataFrame.org[0];
            var _dmap = {}; //以分组的字段值做为key

            _.each( this.dataFrame.org , function( row , i ){
                if( i ){
                    //从i==1 行开始，因为第一行是titles
                    if( !_dmap[ row[groupFieldInd] ] ){
                        //如果没有记录，先创建
                        _dmap[ row[groupFieldInd] ] = [
                            _.clone( titles )
                        ]
                    };
                    _dmap[ row[groupFieldInd] ].push( row );
                }
            } );

            for( var r in _dmap ){
                this.groupDataFrames.push( dataFrame( _dmap[r] ) );
            };
        } else {
            //如果分组字段不存在，则认为数据不需要分组，直接全部作为 group 的一个子集合
            this.groupDataFrames.push( this.dataFrame );
        };
    }

    //graphs方法
    show( field , trigger )
    {
        this.getAgreeNodeData( trigger, function( data ){
            data.nodeElement && (data.nodeElement.context.visible = true);
            data.labelElement && (data.labelElement.context.visible = true);
        } );
    }

    hide( field , trigger)
    {
        this.getAgreeNodeData( trigger, function( data ){
            data.nodeElement && (data.nodeElement.context.visible = false);
            data.labelElement && (data.labelElement.context.visible = false);
        } );
    }

    getAgreeNodeData( trigger , callback)
    {
        var me = this;
        _.each( this._ringGroups, function( _g ){
            _.each( _g._rings , function( ring , i ){
                _.each( ring.planets, function( data , ii){
                    var rowData = data.rowData;
                    if( trigger.params.name == rowData[ trigger.params.field ] ){
                        //这个数据符合
                        //data.nodeElement.context.visible = false;
                        //data.labelElement.context.visible = false;
                        callback && callback( data );
                    };
                });
            });
        } );
    }

    //获取所有有效的在布局中的nodeData
    getLayoutNodes(){
        var nodes = [];
        _.each( this._ringGroups, function( rg ){
            _.each(rg.planets, function( node ){
                if( node.pit ){
                    nodes.push( node );
                };
            })
        } );
        return nodes;
    }

    //获取所有无效的在不在布局的nodeData
    getInvalidNodes(){
        var nodes = [];
        _.each( this._ringGroups, function( rg ){
            _.each(rg.planets, function( node ){
                if( !node.pit ){
                    nodes.push( node );
                };
            })
        } );
        return nodes;
    }

    //ind 对应源数据中的index
    selectAt( ind ){
        var me = this;
        _.each( me._ringGroups, function( _g ){
            _g.selectAt( ind );
        } );
    }

    //selectAll
    selectAll(){
        var me = this;
        _.each( me.dataFrame.getFieldData("__index__") , function( _ind ){
            me.selectAt( _ind )
        } );
    }

    //ind 对应源数据中的index
    unselectAt( ind ){
        var me = this;
        _.each( me._ringGroups, function( _g ){
            _g.unselectAt( ind );
        } );
    }

    //unselectAll
    unselectAll( ind ){
        var me = this;
        _.each( me.dataFrame.getFieldData("__index__") , function( _ind ){
            me.unselectAt( _ind )
        } );
    }

    //获取所有的节点数据
    getSelectedNodes(){
        var arr = [];
        _.each( this._ringGroups, function( _g ){
            arr = arr.concat( _g.getSelectedNodes() );
        } );
        return arr;
    }

    //获取所有的节点数据对应的原始数据行
    getSelectedRowList(){
        var arr = [];
        _.each( this._ringGroups, function( _g ){
            var rows = [];
            _.each( _g.getSelectedNodes(), function( nodeData ){
                rows.push( nodeData.rowData );
            } );
            arr = arr.concat( rows );
        } );
        return arr;
    }

    getNodesAt(){

    }


    resetData( dataFrame , dataTrigger )
    {
        this.clean();
        this.dataFrame = dataFrame;
        this._dataGroupHandle();
        this._drawGroups();
        this._drawScan();
    }


    clean(){
        var me = this;
        me.groupDataFrames = [];
       
        _.each( me._ringGroups , function(_g){
            _g.sprite.destroy();
        } );
        me._ringGroups = [];

    }

}

global.registerComponent( PlanetGraphs, 'graphs', 'planet' );

export default PlanetGraphs;