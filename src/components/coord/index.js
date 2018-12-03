import Component from "../component"
import Canvax from "canvax"
import { _ } from "mmvis"


export default class coorBase extends Component
{
	constructor(opt, app){
        super(opt, app);

        this.name = "coord";

        this._opt = opt;
        this.app  = app;
        this.dataFrame = this.app.dataFrame;

        //这个width为坐标系的width，height， 不是 图表的width和height（图表的widht，height有padding等）
        this.width  = 0;
        this.height = 0;
        this.origin = {
            x : 0,
            y : 0
        };

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
}