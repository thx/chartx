import Group from "./group"
import GraphsBase from "../index"
import { _ } from "canvax"
import {getDefaultProps} from "../../../utils/tools"

class LineGraphs extends GraphsBase
{

    static defaultProps(){
        return {
            field : {
                detail : '字段配置，支持二维数组格式',
                default: null
            },
            yAxisAlign : {
                detail : '绘制在哪根y轴上面',
                default: 'left'
            },
            _props : [
                Group
            ]
        }
    }

    constructor(opt, app)
    {
        super( opt, app );

        this.type = "line";

        this.enabledField = null;
        
        this.groups = []; //群组集合

        _.extend(true, this, getDefaultProps( LineGraphs.defaultProps() ), opt);

        this.init();
    }

    init()
    {
       
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
        
        let me = this;
        
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
        this.enabledField = this.app.getComponent({name:'coord'}).filterEnabledFields( this.field );
    }

    //dataFrame
    _trimGraphs()
    {
        let me = this;
        let _coord = this.app.getComponent({name:'coord'});
        
        //{"uv":{}.. ,"ppc": "pv":]}
        //这样按照字段摊平的一维结构
        let tmpData = {}; 

        me.setEnabledField();

        _.each( _.flatten( me.enabledField ) , function( field, i ){
            //let maxValue = 0;

            let fieldMap = me.app.getComponent({name:'coord'}).getFieldMapOf( field );

            //单条line的全部data数据
            let _lineData = me.dataFrame.getFieldData(field);
            
            if( !_lineData ) return;
            //console.log( JSON.stringify( _lineData ) )
            let _data = [];

            for (let b = 0, bl = _lineData.length; b < bl; b++) {

                //返回一个和value的结构对应的point结构{x:  y: }
                let point = _coord.getPoint( {
                    iNode : b,
                    field : field,
                    value : {
                        //x:
                        y : _lineData[ b ]
                    }
                } );

                let node = {
                    type     : "line",
                    iGroup   : i,
                    iNode    : b,
                    field    : field,
                    value    : _lineData[b],
                    x        : point.pos.x,
                    y        : point.pos.y,
                    rowData  : me.dataFrame.getRowDataAt( b ),
                    color    : fieldMap.color //默认设置皮肤颜色，动态的在group里面会被修改
                };

                _data.push( node );
            };

            tmpData[ field ] = {
                yAxis : fieldMap.yAxis,
                field : field,
                data  : _data
            };

        } );
    
        return tmpData;
    }

    /**
     * 生长动画
     */
    grow(callback)
    {
        let gi = 0;
        let gl = this.groups.length;
        let me = this;
        _.each(this.groups, function(g) {
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
        let me = this;
        
        //过渡优化，有field的状态变化，可能就y轴的数据区间都有了变化，这里的优化就成了bug，所有的field都需要绘制一次
        //这个field不再这个graphs里面的，不相关
        // if( _.indexOf( _.flatten( [me.field] ), field ) == -1 ){
        //     return;
        // };

        this.data = this._trimGraphs();
        this._setGroupsForYfield( this.data , field );
        
        _.each(this.groups, function(g) {
            g.resetData( me.data[ g.field ].data );
        });
    }

    hide( field )
    {
        
        let me = this;
        let i = me.getGroupIndex( field );
        if( i > -1 ){
            this.groups.splice(i, 1)[0].destroy();
            //return; //这里不能直接return，和上面的show一样，同样的属于过渡优化，因为这个时候y轴的值域可能变了， 其他的graphs需要重新绘制
        };

        this.data = this._trimGraphs();
        _.each(this.groups, function(g) {
            g.resetData( me.data[ g.field ].data );
        });
    }

    getGroupIndex( field )
    {
        let ind = -1;
        for( let i=0,l=this.groups.length; i<l; i++  ){
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
        let me = this;

        !opt && (opt ={});

        if( fields ){
            //如果有传入field参数，那么就说明只需要从data里面挑选指定的field来添加
            //一般用在add()执行的时候
            fields = _.flatten( [fields] );
        }

        let _flattenField = _.flatten( [ this.field ] );

        _.each( data , function( g, field ){
        
            if( fields && _.indexOf( fields, field ) == -1 ){
                //如果有传入fields，但是当前field不在fields里面的话，不需要处理
                //说明该group已经在graphs里面了
                return;
            };

            let fieldMap = me.app.getComponent({name:'coord'}).getFieldMapOf( field );
            
            //iGroup 是这条group在本graphs中的ind，而要拿整个图表层级的index， 就是fieldMap.ind
            let iGroup = _.indexOf( _flattenField, field );

            let group = new Group(
                fieldMap,
                iGroup, //不同于fieldMap.ind
                me._opt,
                me.ctx,
                me.height,
                me.width,
                me
            );

            group.draw( {
                animation : me.animation && !opt.resize
            }, g.data );

            let insert = false;
            //在groups数组中插入到比自己_groupInd小的元素前面去
            for( let gi=0,gl=me.groups.length ; gi<gl ; gi++ ){
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

    getNodesAt( ind, e )
    {
        let _nodesInfoList = []; //节点信息集合
        _.each( this.groups, function( group ){
            let node = group.getNodeInfoAt( ind, e );
            node && _nodesInfoList.push( node );
        } );
        return _nodesInfoList;
    }

    getNodesOfPos( x )
    {
        let _nodesInfoList = []; //节点信息集合
        _.each( this.groups, function( group ){
            let node = group.getNodeInfoOfX( x );
            node && _nodesInfoList.push( node );
        } );
        return _nodesInfoList;
    }
}

GraphsBase.registerComponent( LineGraphs, 'graphs', 'line' );

export default LineGraphs;