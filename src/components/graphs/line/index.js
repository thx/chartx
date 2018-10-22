import Canvax from "canvax"
import Group from "./group"
import {getDisMinATArr} from "../../../utils/tools"
import GraphsBase from "../index"

const _ = Canvax._;
const Rect = Canvax.Shapes.Rect;

export default class LineGraphs extends GraphsBase
{
    constructor(opt, root)
    {
        super( opt, root );

        this.type = "line";

        //默认给左轴
        this.yAxisAlign = "left";

        this.field  = null;
        this.enabledField = null;
        
        this.groups = []; //群组集合

        _.extend(true, this, opt);

        this.init(this._opt);
    }

    init(opt)
    {
        opt.yAxisAlign && (this.yAxisAlign = opt.yAxisAlign);
        this.sprite = new Canvax.Display.Sprite();
    }

    draw(opt)
    {
        !opt && (opt ={});
        this.width = opt.width;
        this.height = opt.height;
        _.extend( true, this.origin, opt.origin );

        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        this.data = this._trimGraphs();

        this._setGroupsForYfield( this.data , null, opt );

        //this.grow();
        if( this.animation && !opt.resize ){
            this.grow();
        } else {
            this.fire("complete");
        }
        
        return this;
        
    }

    resetData(dataFrame, dataTrigger)
    {
        
        var me = this;

        if( dataFrame ){
            me.dataFrame = dataFrame;
            me.data = me._trimGraphs();
        };

        _.each( me.groups, function(g){
            g.resetData( me.data[ g.field ].data , dataTrigger );
        } );
    }

    setEnabledField()
    {
        //要根据自己的 field，从enabledFields中根据enabled数据，计算一个 enabled版本的field子集
        this.enabledField = this.root._coord.getEnabledFields( this.field );
    }

    //_yAxis, dataFrame
    _trimGraphs()
    {
        var me = this;
        var _coor = this.root._coord;
        
        //{"uv":{}.. ,"click": "pv":]}
        //这样按照字段摊平的一维结构
        var tmpData = {}; 

        me.setEnabledField();

        var _yAxis = this.yAxisAlign == "right" ? _coor._yAxisRight : _coor._yAxisLeft;

        _.each( _.flatten( me.enabledField ) , function( field, i ){
            //var maxValue = 0;

            var fieldMap = me.root._coord.getFieldMapOf( field );

            //单条line的全部data数据
            var _lineData = me.dataFrame.getFieldData(field);
            if( !_lineData ) return;

            var _data = [];

            for (var b = 0, bl = _lineData.length; b < bl; b++) {
                var _xAxis = me.root._coord ? me.root._coord._xAxis : me.root._xAxis;
                var x = _xAxis.getPosX( {
                    ind : b,
                    dataLen : bl,
                    layoutType : me.root._coord ? me.root._coord.xAxis.layoutType : me.root._xAxis.layoutType
                } );
                
                //var y = _.isNumber( _lineData[b] ) ? _yAxis.getPosFromVal( _lineData[b] ) : undefined; //_lineData[b] 没有数据的都统一设置为undefined，说明这个地方没有数据
                
                var y = _lineData[b];
                if( !isNaN( y ) && y !== null && y !== undefined && y !== ""  ){
                    y = _yAxis.getPosFromVal( y );
                } else {
                    y = undefined;
                };

                var node = {
                    type     : "line",
                    iGroup   : i,
                    iNode    : b,
                    field    : field,
                    value    : _lineData[b],
                    x        : x,
                    y        : y,
                    rowData  : me.dataFrame.getRowData( b ),
                    color    : fieldMap.color
                };

                _data.push( node );
                
            };

            tmpData[ field ] = {
                yAxis: _yAxis,
                field: field,
                data: _data
            };

        } );
    
        return tmpData;
    }

    /**
     * 生长动画
     */
    grow(callback)
    {
        var gi = 0;
        var gl = this.groups.length;
        var me = this;
        _.each(this.groups, function(g, i) {
            g._grow(function(){
                gi++;
                callback && callback( g );
                if( gi == gl ){
                    me.fire("complete");
                }
            });
        });
        return this;
    }

    show( field )
    {
        var me = this;
        
        //这个field不再这个graphs里面的，不相关
        if( _.indexOf( _.flatten( [me.field] ), field ) == -1 ){
            return;
        };

        this.data = this._trimGraphs();
        this._setGroupsForYfield( this.data , field );
        
        _.each(this.groups, function(g, i) {
            g.resetData( me.data[ g.field ].data );
        });
    }

    hide( field )
    {
        var me = this;
        var i = me.getGroupIndex( field );

        if( !this.groups.length || i < 0 ){
            return;
        };

        this.groups.splice(i, 1)[0].destroy();
        this.data = this._trimGraphs();

        _.each(this.groups, function(g, i) {
            g.resetData( me.data[ g.field ].data );
        });
    }

    getGroupIndex( field )
    {
        var ind = -1;
        for( var i=0,l=this.groups.length; i<l; i++  ){
            if( this.groups[i].field === field ){
                ind = i;
                break;
            }
        }
        return ind
    }

    getGroup( field )
    {
       return this.groups[ this.getGroupIndex(field) ]
    }

    _setGroupsForYfield(data , fields, opt)
    {
        var me = this;

        !opt && (opt ={});

        if( fields ){
            //如果有传入field参数，那么就说明只需要从data里面挑选指定的field来添加
            //一般用在add()执行的时候
            fields = _.flatten( [fields] );
        }

        var _flattenField = _.flatten( [ this.field ] );

        _.each( data , function( g, field ){
        
            if( fields && _.indexOf( fields, field ) == -1 ){
                //如果有传入fields，但是当前field不在fields里面的话，不需要处理
                //说明该group已经在graphs里面了
                return;
            };

            var fieldMap = me.root._coord.getFieldMapOf( field );
            
            //iGroup 是这条group在本graphs中的ind，而要拿整个图表层级的index， 就是fieldMap.ind
            var iGroup = _.indexOf( _flattenField, field );

            var group = new Group(
                fieldMap,
                iGroup, //不同于fieldMap.ind
                me._opt,
                me.ctx,
                me.height,
                me.width
            );

            group.draw( {
                animation : me.animation && !opt.resize
            }, g.data );

            var insert = false;
            //在groups数组中插入到比自己_groupInd小的元素前面去
            for( var gi=0,gl=me.groups.length ; gi<gl ; gi++ ){
                if( iGroup < me.groups[gi].iGroup ){

                    me.groups.splice( gi , 0 , group );
                    insert=true;
                    me.sprite.addChildAt(group.sprite , gi);
                    
                    break;
                }
            };
            //否则就只需要直接push就好了
            if( !insert ){
                me.groups.push(group);
                me.sprite.addChild(group.sprite);
            };

        } );

    }

    getNodesAt( ind )
    {
        var _nodesInfoList = []; //节点信息集合
        _.each( this.groups, function( group ){
            var node = group.getNodeInfoAt( ind );
            node && _nodesInfoList.push( node );
        } );
        return _nodesInfoList;
    }
}