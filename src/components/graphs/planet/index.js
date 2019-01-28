import Canvax from "canvax"
import GraphsBase from "../index"
import Group from "./group"
import { dataFrame,_,getDefaultProps } from "mmvis"

const Text = Canvax.Display.Text;
const Circle = Canvax.Shapes.Circle;
const Line = Canvax.Shapes.Line;
const Rect = Canvax.Shapes.Rect;

export default class PlanetGraphs extends GraphsBase
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

        this.init();
    }
    
    init()
    {
        this.gridSp = new Canvax.Display.Sprite({ 
            id : "gridSp"
        });

        this.sprite.addChild( this.gridSp );
        this._dataGroupHandle();
    }

    draw( opt )
    {
        
        !opt && (opt ={});

        _.extend( true, this , opt );

        this._drawGroups();

        this._drawCenter();

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

        me._drawBack();
        
        _.each( me._ringGroups , function(_g){
            me.sprite.addChild( _g.sprite );
        } );
    }

    _drawCenter()
    {
        if( this.center.enabled ){
            //绘制中心实心圆
            this._center = new Circle({
                context : {
                    x : this.origin.x,
                    y : this.origin.y,
                    fillStyle : this.center.fillStyle,
                    r : this.center.radius
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
            this.sprite.addChild( this._center );
            this.sprite.addChild( this._centerTxt );
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

}
