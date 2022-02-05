import Component from "../component"
import Canvax from "canvax"
import {getDefaultProps} from "../../utils/tools"
import numeral from "numeral"

let _ = Canvax._;

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
            fieldsConfig : {
                detail: '字段的配置信息({uv:{name:"",format:""}})，包括中文名称和格式化单位，内部使用numeral做格式化',
                default: {}
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
        let me = this;
        let ind = 0;

        let axisType = axisExp.type || "yAxis";

        let fieldsArr = [];
        _.each( this.getAxiss( axisExp ), function( _axis ){
            if( _axis.field ){
                fieldsArr = fieldsArr.concat( _axis.field );
            };
        } );

        let graphs = _.flatten( [this.app._opt.graphs] );
        
        function _set( fields ){
    
            if( _.isString(fields) ){
                fields = [fields];
            };

            let clone_fields = _.clone( fields );
            for(let i = 0 , l=fields.length ; i<l ; i++) {
                let field = fields[i];
                if( _.isString( field ) ){

                    let color = me.app.getTheme( ind );

                    let graph;
                    let graphFieldInd;
                    let graphColorProp; //graphs.find( graph => {_.flatten([graph.field]).indexOf( field )} ).color;
                    for( let _i=0,_l=graphs.length; _i<_l; _i++ ){
                        graph = graphs[ _i ];
                        graphFieldInd = _.flatten([graph.field]).indexOf( field );
                        if( graphFieldInd >-1 ){
                            graphColorProp = graph.color;
                            break;
                        }
                    };
                    if( graphColorProp ){
                        if( typeof graphColorProp == 'string' ){
                            color = graphColorProp
                        }
                        if( Array.isArray( graphColorProp ) ){
                            color = graphColorProp[ graphFieldInd ]
                        }
                        if( typeof graphColorProp == 'function' ){
                            color = graphColorProp.apply( me.app, [ graph ] )
                        }
                    };

                    let config = me.fieldsConfig[ field ]; 

                    let fieldItem = {
                        field, 
                        name: field, //fieldConfig中可能会覆盖
                        enabled : true,
                        color,
                        ind : ind++,
                        ...(me.fieldsConfig[ field ] || {})
                    };

                    fieldItem.getFormatValue = ( value )=>{
                        if( config && config.format ){
                            if( typeof config.format == 'string' ){
                                //如果传入的是 字符串，那么就认为是 numeral 的格式字符串
                                value = numeral(value).format( config.format )
                            }
                            if( typeof config.format == 'function' ){
                                //如果传入的是 字符串，那么就认为是 numeral 的格式字符串
                                value = config.format.apply( me, { field, } )
                            }
                        } else {
                            value = typeof(value) == "object" ? JSON.stringify(value) : numeral(value).format('0,0');
                        };
                        return value;
                    };

                    fieldItem[ axisType ] = me.getAxis({ type:axisType, field:field })
                    
                    clone_fields[i] = fieldItem;

                };
                if( _.isArray( field ) ){
                    clone_fields[i] = _set( field, ind );
                };
            };

            return clone_fields;
        };

        return _set( fieldsArr );
    }

    //设置 fieldsMap 中对应field 的 enabled状态
    setFieldEnabled( field )
    {
        let me = this;
        function set( maps ){
            _.each( maps , function( map ){
                if( _.isArray( map ) ){
                    set( map )
                } else if( map.field && map.field == field ) {
                    map.enabled = !map.enabled;
                }
            } );
        }
        set( me.fieldsMap );
    }

    //从FieldsMap中获取对应的config
    getFieldConfig( field )
    {
        let me = this;
        let fieldConfig = null;
        function get( maps ){
            _.each( maps , function( map ){
                if( _.isArray( map ) ){
                    get( map )
                } else if( map.field && map.field == field ) {
                    fieldConfig = map;
                    return false;
                }
            } );
        }
        get( me.fieldsMap );
        return fieldConfig;
    }

    //从 fieldsMap 中过滤筛选出来一个一一对应的 enabled为true的对象结构
    //这个方法还必须要返回的数据里描述出来多y轴的结构。否则外面拿到数据后并不好处理那个数据对应哪个轴
    getEnabledFieldsOf( axis )
    {
        
        let enabledFields = [];
        let axisType = axis ? axis.type : "yAxis";

        _.each( this.fieldsMap, function( bamboo ){
            if( _.isArray( bamboo ) ){
                //多节竹子，堆叠

                let fields = [];
                
                //设置完fields后，返回这个group属于left还是right的axis
                _.each( bamboo, function( obj ){
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
        let me = this;
        let arr = [];
        if( !_.isArray( fields ) ) fields = [ fields ];
        _.each( fields, function( f ){
            if( !_.isArray( f ) ){
                if( me.getFieldConfig(f).enabled ){
                    arr.push( f );
                }
            } else {
                //如果这个是个纵向数据，说明就是堆叠配置
                let varr = [];
                _.each( f, function( v_f ){
                    if( me.getFieldConfig( v_f ).enabled ){
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
    getPoint(  ){
        
    }

    getAxisOriginPoint(){

    }

    getOriginPos(){

    }
    

    //获取对应轴的接口
    getAxis( opt ){
        let axiss = this.getAxiss( opt );
        return axiss[0];
    }

    getAxiss( opt ){

        let arr = [];
        let expCount = Object.keys(opt).length;

        _.each( this._axiss, function( item ){
            let i= 0;
            for( let p in opt ){
                if( p == 'field' ){
                    //字段的判断条件不同
                    let fs = _.flatten( [ item[p] ] );
                    let expFs = _.flatten( [ opt[p] ] );

                    let inFs = true;
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