import Component from "../component"
import Canvax from "canvax"
import { _,getDefaultProps } from "mmvis"

export default class coordBase extends Component
{
    static defaultProps(){
        return {
            type : {
                detail : '坐标系组件',
                documentation : "坐标系组件，可选值有'rect'（二维直角坐标系）,'polar'（二维极坐标系）,'box'（三维直角坐标系） ",
                insertText    : "type: ",
                default       : "",
                values        : ["rect","polar","box","polar3d"]
            },
            width : {
                detail : '坐标系width',
                default: 0
            },
            height : {
                detail : '坐标系height',
                default: 0
            },
            origin : {
                detail : '坐标系原点',
                propertys : {
                    x : {
                        detail : '原点x位置',
                        default : 0
                    },
                    y : {
                        detail : '原点x位置',
                        default : 0
                    }
                }
            },
            _children  : {
                rect  : {},
                polar : {},
                box   : {},
                polar : {}
            }
        }
    }
    

	constructor(opt, app){
        
        super(opt, app);
        _.extend( true, this, getDefaultProps( coordBase.defaultProps() ) ); 

        this.name = "coord";

        this._opt = opt;
        this.app  = app;
        this.dataFrame = this.app.dataFrame;

        this.sprite = new Canvax.Display.Sprite({
            name : "coord_"+opt.type
        });
        this.app.coordSprite.addChild( this.sprite );
        

        /*
        吧原始的field转换为对应结构的显示树
        ["uv"] --> [
            {field:'uv',enabled:true ,yAxis: yAxisleft }
            ...
        ]
        */
        this.fieldsMap = null;
        this.induce = null;

        this._axiss = [];//所有轴的集合
    }
    

    //和原始field结构保持一致，但是对应的field换成 {field: , enabled:...}结构
    setFieldsMap( axisExp )
    {
        var me = this;
        var fieldInd = 0;

        var axisType = axisExp.type || "yAxis";

        var fieldsArr = [];
        _.each( this.getAxiss( axisExp ), function( _axis ){
            if( _axis.field ){
                fieldsArr = fieldsArr.concat( _axis.field );
            };
        } );
        
        function _set( fields ){
    
            if( _.isString(fields) ){
                fields = [fields];
            };

            var clone_fields = _.clone( fields );
            for(var i = 0 , l=fields.length ; i<l ; i++) {
                if( _.isString( fields[i] ) ){
                    clone_fields[i] = {
                        field   : fields[i],
                        enabled : true,
                        //yAxis : me.getAxis({type:'yAxis', field:fields[i] }),
                        color   : me.app.getTheme(fieldInd),
                        ind     : fieldInd++
                    };
                    clone_fields[i][ axisType ] = me.getAxis({type:axisType, field:fields[i] })
                };
                if( _.isArray( fields[i] ) ){
                    clone_fields[i] = _set( fields[i], fieldInd );
                };
            };

            return clone_fields;
        };

        return _set( fieldsArr );
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

    //从 fieldsMap 中过滤筛选出来一个一一对应的 enabled为true的对象结构
    //这个方法还必须要返回的数据里描述出来多y轴的结构。否则外面拿到数据后并不好处理那个数据对应哪个轴
    getEnabledFieldsOf( axis )
    {
        
        var enabledFields = [];
        var axisType = axis ? axis.type : "yAxis";

        _.each( this.fieldsMap, function( bamboo, b ){
            if( _.isArray( bamboo ) ){
                //多节竹子，堆叠

                var fields = [];
                
                //设置完fields后，返回这个group属于left还是right的axis
                _.each( bamboo, function( obj, v ){
                    if( obj[ axisType ] === axis && obj.field && obj.enabled ){
                        fields.push( obj.field );
                    }
                } );

                fields.length && enabledFields.push( fields );

            } else {
                //单节棍
                if( bamboo[ axisType ] === axis && bamboo.field && bamboo.enabled ){
                    enabledFields.push( bamboo.field );
                }
            };
        } );

        return enabledFields;
    }

    //如果有传参数 fields 进来，那么就把这个指定的 fields 过滤掉 enabled==false的field
    //只留下enabled的field 结构
    filterEnabledFields( fields ){
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

    getAxisDataFrame( fields )
    {
        return {
            field : fields,
            org : this.dataFrame.getDataOrg( fields , function( val ){
                if( val === undefined || val === null || val == "" ){
                    return val;
                }
                return (isNaN(Number( val )) ? val : Number( val ))
            })
        }
    }

    hide( field )
    {
        this.changeFieldEnabled( field );
    }

    show( field )
    {
        this.changeFieldEnabled( field );
    }

    getSizeAndOrigin()
    {
        return {
            width : this.width,
            height : this.height,
            origin : this.origin
        };
    }

    /**
     * @param { opt.field  } field 用来查找对应的yAxis
     * @param { opt.iNode  } iNode 用来查找对应的xaxis的value
     * @param { opt.value {xval: yval:} }
     */
    getPoint( opt ){
        
    }

    getAxisOriginPoint(exp){

    }

    getOriginPos(exp){

    }
    

    //获取对应轴的接口
    getAxis( opt ){
        var axiss = this.getAxiss( opt );
        return axiss[0];
    }

    getAxiss( opt ){

        var arr = [];
        var expCount = 0;
        for( var p in opt ){
            expCount++;
        };

        _.each( this._axiss, function( item ){
            var i= 0;
            for( var p in opt ){
                if( p == 'field' ){
                    //字段的判断条件不同
                    var fs = _.flatten( [ item[p] ] );
                    var expFs = _.flatten( [ opt[p] ] );

                    var inFs = true;
                    _.each( expFs, function( exp ){
                        if( _.indexOf(fs, exp) == -1 ){
                            //任何一个field不再fs内， 说明配对不成功
                            inFs = false;
                        }
                    } );
                    if( inFs ){
                        i++
                    };
                } else {
                    if( JSON.stringify( item[p] ) == JSON.stringify( opt[p] ) ){
                        i++
                    };
                };
            };
            if( expCount == i ){
                arr.push( item );
            };
        } );
        
        return arr;
    }
}