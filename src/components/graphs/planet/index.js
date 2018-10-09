import Canvax from "canvax"
import GraphsBase from "../index"
import DataFrame from "../../../utils/dataframe"
import Group from "./group"

const _ = Canvax._;
const Text = Canvax.Display.Text;
const Circle = Canvax.Shapes.Circle;
const Line = Canvax.Shapes.Line;
const Rect = Canvax.Shapes.Rect;

export default class PlanetGraphs extends GraphsBase
{
    constructor(opt, root)
    {
        super( opt, root );

        this.type = "planet";

        this.field = null;
        
        //this.legendField = null;

        var me = this;
        //圆心原点坐标
        this.center = {
            enabled   : true,
            text      : "center",
            radius    : 30,
            fillStyle : "#70629e",
            fontSize  : 15,
            fontColor : "#ffffff",
            margin    : 20 //最近ring到太阳的距离
        };

        this.groupDataFrames = [];
        this.groupField = null;
        this._ringGroups = []; //groupField对应的 group 对象

        //planet自己得grid，不用polar的grid
        this.grid = {
            rings : {
                fillStyle : null,
                strokeStyle: null,
                lineWidth : 1,
                section: [], //环形刻度线集合
                count: 3 //在 section.length>1 的时候会被修改为 section.length
            },
            rays : {
                count : 0,
                lineWidth : 1,
                strokeStyle : "#10519D",
                globalAlpha : 0.4
            }
        };

        this.selectInds = []; //源数据中__index__的集合，外面可以传入这个数据进来设置选中

        _.extend( true, this , opt );

        if( this.center.radius == 0 || !this.center.enabled ){
            this.center.radius = 0;
            this.center.margin = 0;
            this.center.enabled = false;
        };

        this.init();
    }
    
    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "graphsEl"
        });

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

    getLegendData()
    {
        var list = [];
        var legendDataList = [];
        if( this.legendField ){
            
            _.each( this.dataFrame.getFieldData( this.legendField ), function( val ){
                if( _.indexOf( list, val ) == -1 ){
                    list.push( val );
                    legendDataList.push({
                        name: val, 
                        field : this.legendField,
                        color: "#ff8533", 
                        enabled: true, 
                        ind: 0
                    });
                };
            } );

        };

        return legendDataList;
    }
    

    _getMaxR()
    {
        var _circleMaxR;
        try{
            _circleMaxR = this.graphs.group.circle.maxR;
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
        
        var maxR = me.root._coord.maxR - me.center.radius - me.center.margin;
        var _circleMaxR = this._getMaxR();

        _.each( this.groupDataFrames , function( df , i ){
            
            var toR = groupRStart + maxR*( (df.length) / (me.dataFrame.length) );
            
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

            me.grid.rings.section.push({
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
        
        if( me.grid.rings.section.length == 1 ){

            //如果只有一个，那么就强制添加到3个
            var _diffR = (me.grid.rings.section[0].radius - me.center.radius) / me.grid.rings.count;
            me.grid.rings.section = [];
            for( var i=0;i<me.grid.rings.count ; i++ ){
                me.grid.rings.section.push({
                    radius : me.center.radius + _diffR*(i+1)
                });
            }

        } else {
            me.grid.rings.count = me.grid.rings.section.length;
        };

        
        for( var i=me.grid.rings.section.length-1 ; i>=0 ; i-- ){
            var _scale = me.grid.rings.section[i];
            me.gridSp.addChild( new Circle({
                context : {
                    x : me.root._coord.origin.x,
                    y : me.root._coord.origin.y,
                    r : _scale.radius,
                    lineWidth : me._getBackProp( me.grid.rings.lineWidth , i),
                    strokeStyle : me._getBackProp( me.grid.rings.strokeStyle , i),
                    fillStyle: me._getBackProp( me.grid.rings.fillStyle , i)
                }
            }) );
        };

        
        //如果back.rays.count非0， 则绘制从圆心出发的射线
        if( me.grid.rays.count > 1 ){
            var cx = this.root._coord.origin.x;
            var cy = this.root._coord.origin.y;
            var itemAng = 360 / me.grid.rays.count;
            var _r = me.root._coord.maxR; //Math.max( me.w, me.h );

            if( me.grid.rings.section.length ){
                _r = me.grid.rings.section.slice(-1)[0].radius
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
                x : me.root._coord.origin.x-me.root.width/2,
                y : me.root._coord.origin.y-me.height/2,
                width : me.root.width,
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
                count : this.grid.rings.section.length,

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
                this.groupDataFrames.push( DataFrame( _dmap[r] ) );
            };
        } else {
            //如果分组字段不存在，则认为数据不需要分组，直接全部作为 group 的一个子集合
            this.groupDataFrames.push( this.dataFrame );
        };
    }





    //graphs方法

    show( field , legendData)
    {
        this.getAgreeNodeData( legendData, function( data ){
            data.nodeElement && (data.nodeElement.context.visible = true);
            data.labelElement && (data.labelElement.context.visible = true);
        } );
    }

    hide( field , legendData)
    {
        this.getAgreeNodeData( legendData, function( data ){
            data.nodeElement && (data.nodeElement.context.visible = false);
            data.labelElement && (data.labelElement.context.visible = false);
        } );
    }

    getAgreeNodeData( legendData , callback)
    {
        var me = this;
        _.each( this._ringGroups, function( _g ){
            _.each( _g._rings , function( ring , i ){
                _.each( ring.planets, function( data , ii){
                    var rowData = data.rowData;
                    if( legendData.name == rowData[ legendData.field ] ){
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
