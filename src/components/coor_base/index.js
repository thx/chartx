import Component from "../component"
import Canvax from "canvax2d"

const _ = Canvax._;

export default class coorBase extends Component
{
	constructor(opts, root){
        super(opts, root);

        this._opts = opts;
        this.root  = root;
        this.dataFrame = this.root.dataFrame;

        //这个width为坐标系的width，height， 不是 图表的width和height（图表的widht，height有padding等）
        this.width  = 0;
        this.height = 0;
        this.origin = {
            x : 0,
            y : 0
        };

        this.sprite = null;
        
        /*
        吧原始的field转换为对应结构的显示树
        ["uv"] --> [
            {field:'uv',enabled:true ,yAxis: yAxisleft }
            ...
        ]
        */
        this.fieldsMap = null;
        this.induce = null;
    }
    
    //从 fieldsMap 中过滤筛选出来一个一一对应的 enabled为true的对象结构
    //这个方法还必须要返回的数据里描述出来多y轴的结构。否则外面拿到数据后并不好处理那个数据对应哪个轴
    getEnabledFields( fields )
    {
        if( fields ){
            //如果有传参数 fields 进来，那么就把这个指定的 fields 过滤掉 enabled==false的field
            //只留下enabled的field 结构
            return this._filterEnabledFields( fields );
        }
        var fmap = {
            left: [], right:[]
        };

        _.each( this.fieldsMap, function( bamboo, b ){
            if( _.isArray( bamboo ) ){
                //多节竹子

                var align;
                var fields = [];
                
                //设置完fields后，返回这个group属于left还是right的axis
                _.each( bamboo, function( obj, v ){
                    if( obj.field && obj.enabled ){
                        align = obj.yAxis.align;
                        fields.push( obj.field );
                    }
                } );

                fields.length && fmap[ align ].push( fields );

            } else {
                //单节棍
                if( bamboo.field && bamboo.enabled ){
                    fmap[ bamboo.yAxis.align ].push( bamboo.field );
                }
            };
        } );

        return fmap;
    }

    //如果有传参数 fields 进来，那么就把这个指定的 fields 过滤掉 enabled==false的field
    //只留下enabled的field 结构
    _filterEnabledFields( fields ){
        var me = this;
        var arr = [];
        if( !_.isArray( fields ) ) fields = [ fields ];
        _.each( fields, function( f ){
            if( !_.isArray( f ) ){
                if( me.getFieldMapOf(f).enabled ){
                    arr.push( f );
                }
            } else {
                //如果这个是个纵向数据，说明就是堆叠配置
                var varr = [];
                _.each( f, function( v_f ){
                    if( me.getFieldMapOf( v_f ).enabled ){
                        varr.push( v_f );
                    }
                } );
                if( varr.length ){
                    arr.push( varr )
                }
            }
        } );
        return arr;
    }

    //设置 fieldsMap 中对应field 的 enabled状态
    setFieldEnabled( field )
    {
        var me = this;
        function set( maps ){
            _.each( maps , function( map , i ){
                if( _.isArray( map ) ){
                    set( map )
                } else if( map.field && map.field == field ) {
                    map.enabled = !map.enabled;
                }
            } );
        }
        set( me.fieldsMap );
    }

    getFieldMapOf( field )
    {
        var me = this;
        var fieldMap = null;
        function get( maps ){
            _.each( maps , function( map , i ){
                if( _.isArray( map ) ){
                    get( map )
                } else if( map.field && map.field == field ) {
                    fieldMap = map;
                    return false;
                }
            } );
        }
        get( me.fieldsMap );
        return fieldMap;
    }
}