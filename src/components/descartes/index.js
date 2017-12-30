import Component from "../component"
import Canvax from "canvax2d"
import xAxisConstructor from "../xaxis/index"
import yAxisConstructor from "../yaxis/index"
import Grid from "../grid/index"
import {colors as themeColors} from "../../chart/theme"

const _ = Canvax._;

export default class Descartes_Component extends Component
{
    constructor( opt, root )
    {
        super();

        this._root  = root;
        
        this._xAxis = null;
        this._yAxis = [];

        this._yAxisLeft = null;
        this._yAxisRight = null;
        this._grid  = null;

        this.graphsWidth = 0;
        this.graphsHeight = 0;
        this.graphsX = 0;
        this.graphsY = 0;

        this.horizontal = false;

        this.dataFrame = this._root.dataFrame;

        this.xAxis = {
            field : this.dataFrame.fields[0]
        };
        this.yAxis = {
            field : this.dataFrame.fields.slice(1)
        };
        this.grid = {

        };

        if( opt.horizontal ){
            this.xAxis.text = {    
                rotation: 90
            }
            this.yAxis.text = {
                rotation: 90
            }
        }

        if( "display" in opt ){
            //如果有给直角坐标系做配置display，就直接通知到xAxis，yAxis，grid三个子组件
            this.xAxis.display = opt.display;
            this.yAxis.display = opt.display;
            this.grid.enabled = opt.display;
        };

        //吧原始的field转换为对应结构的显示树
        //["uv"] --> [
        //    {field:'uv',enabled:true ,yAxis: yAxisleft }
        //    ...
        //]
        this.fieldsMap = null; //this._opts.yAxis.field || this._opts.yAxis.bar.field );
        this.init(opt);
    }

    init(opt)
    {
        var me = this;
        _.extend(true, this, opt);

        me.sprite = new Canvax.Display.Sprite({
            id : "coordinate"
        });
        me._initModules();

        //创建好了坐标系统后，设置 _fieldsDisplayMap 的值，
        // _fieldsDisplayMap 的结构里包含每个字段是否在显示状态的enabled 和 这个字段属于哪个yAxis
        this.fieldsMap = this._setFieldsMap();

        //回写xAxis和yAxis到opt上面。如果用户没有传入任何xAxis 和yAxis的话，
        //这回写很有必要
        opt.xAxis = this.xAxis;
        opt.yAxis = this.yAxis;

    }


    resetData( dataFrame , dataTrigger )
    {
        var me = this;
        this.dataFrame = dataFrame;

        var _xAxisDataFrame = this._getAxisDataFrame(this.xAxis.field);
        this._xAxis.resetData( _xAxisDataFrame );

        _.each( this._yAxis , function( _yAxis ){
            //这个_yAxis是具体的y轴实例
            var yAxisDataFrame = me._getAxisDataFrame( _yAxis.field );
            _yAxis.resetData( yAxisDataFrame );
        } );

        this._grid.reset({
            animation:false,
            xAxis: {
                data: this._yAxisLeft.layoutData
            }
        });

    }

    draw( opt )
    {
        var _padding = this._root.padding;
        var h = opt.h || this._root.height;
        var w = opt.w || this._root.width;

        if( this.horizontal ){
            //如果是横向的坐标系统，也就是xy对调，那么高宽也要对调
            var _num = w;
            w = h;
            h = _num;
        };

        var y = h - this._xAxis.height;
        var graphsH = y - _padding.top - _padding.bottom;

        //绘制yAxis
        this._yAxisLeft.draw({
            pos: {
                x: _padding.left,
                y: y - _padding.bottom
            },
            yMaxHeight: graphsH,
            resize : opt.resize
        });

        var _yAxisW = this._yAxisLeft.width;

        //如果有双轴
        var _yAxisRW = 0;
        if (this._yAxisRight) {
            this._yAxisRight.draw({
                pos: {
                    x: 0,
                    y: y - _padding.bottom
                },
                yMaxHeight: graphsH,
                resize : opt.resize
            });
            _yAxisRW = this._yAxisRight.width;
            this._yAxisRight.setX( w - _yAxisRW - _padding.right + 1);
        };

        //绘制x轴
        this._xAxis.draw({
            graphh: h - _padding.bottom,
            graphw: w - _yAxisRW - _padding.right,
            yAxisW: _yAxisW + _padding.left, //左边的yAxisWidth
            resize: opt.resize
        });
        if (this._xAxis.yAxisW != _yAxisW) {
            //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
            this._yAxisLeft.resetWidth(this._xAxis.yAxisW);
            _yAxisW = this._xAxis.yAxisW;
        };


        this.graphsWidth = this._xAxis.xGraphsWidth;
        this.graphsHeight = this._yAxisLeft.yGraphsHeight;
        this.graphsX = _yAxisW;
        this.graphsY = y - _padding.bottom;

        //绘制背景网格
        this._grid.draw({
            w: this.graphsWidth,
            h: this.graphsHeight,
            xAxis: {
                data: this._yAxisLeft.layoutData
            },
            yAxis: {
                data: this._xAxis.layoutData
            },
            yOrigin: {
                biaxial: this.biaxial
            },
            pos: {
                x: this.graphsX,
                y: this.graphsY
            },
            resize: opt.resize
        } );

        if( this.horizontal ){
            this._horizontal({
                w : w,
                h : h
            });
        }

    }
   
    _initModules()
    {

        var _xAxisDataFrame = this._getAxisDataFrame(this.xAxis.field);
        this._xAxis = new xAxisConstructor(this.xAxis, _xAxisDataFrame, this);
        this.sprite.addChild(this._xAxis.sprite);

        //这里定义的是配置
        var yAxis = this.yAxis;
        var yAxisLeft, yAxisRight; 
        var yAxisLeftDataFrame, yAxisRightDataFrame;

        if( !_.isArray( yAxis ) ){
            yAxis = [ yAxis ];
        };

        //left是一定有的
        yAxisLeft = _.find( yAxis , function( ya ){
            return ya.align == "left"
        } ) || yAxis[0];
        yAxisLeft.align = "left";

        yAxisLeftDataFrame = this._getAxisDataFrame( yAxisLeft.field );

        //如果过_yAxis配置是个数组，就说明要配置两个y轴对象，就是拥有左右双轴了
        if( yAxis.length > 1 ){
            yAxisRight = _.find( yAxis , function( ya ){
                return ya.align == "right"
            } ) || yAxis[1];

            yAxisRight.align = "right";
            yAxisRightDataFrame = this._getAxisDataFrame( yAxisRight.field );
        };

        this._yAxisLeft = new yAxisConstructor( yAxisLeft, yAxisLeftDataFrame );
        this._yAxisLeft.axis = yAxisLeft;
        this.sprite.addChild( this._yAxisLeft.sprite );
        this._yAxis.push( this._yAxisLeft );

        if( yAxisRight ){
            this._yAxisRight = new yAxisConstructor( yAxisRight, yAxisRightDataFrame );
            this._yAxisRight.axis = yAxisRight;
            this.sprite.addChild( this._yAxisRight.sprite );
            this._yAxis.push( this._yAxisRight );
        };

        this._grid = new Grid( this.grid, this );
        this.sprite.addChild( this._grid.sprite );
    }

    /**
     * 
     * @param {x,y} size 
     */
    _horizontal( ) 
    {
        
        var me = this;
        var w = me._root.width;
        var h = me._root.height;

        _.each([me.sprite.context], function(ctx) {
            ctx.x += ((w - h) / 2);
            ctx.y += ((h - w) / 2) + me._root.padding.top;
            ctx.rotation = 90;
            ctx.rotateOrigin.x = h / 2;
            ctx.rotateOrigin.y = w / 2;
            ctx.scaleOrigin.x = h / 2;
            ctx.scaleOrigin.y = w / 2;
            ctx.scaleX = -1;
        });

        //把x轴文案做一次镜像反转
        _.each( _.flatten( [ this._xAxis ] ), function( _xAxis ){
            _.each( _xAxis.rulesSprite.children, function( xnode ){
                var ctx = xnode._txt.context;
                var rect = xnode._txt.getRect();
                ctx.scaleOrigin.x = rect.x + rect.width / 2;
                ctx.scaleOrigin.y = rect.y + rect.height / 2;
                ctx.scaleY = -1
            } );
        } );

        //把y轴文案做一次镜像反转
        _.each( _.flatten( [ this._yAxis ] ), function( _yAxis ) {
            _.each( _yAxis.rulesSprite.children, function( ynode ){
                var ctx = ynode._txt.context;
                var rect = ynode._txt.getRect();
                ctx.scaleOrigin.x = rect.x + rect.width / 2;
                ctx.scaleOrigin.y = rect.y + rect.height / 2;
                ctx.scaleY = -1
            } );
        });

    }

    getPosX( opt )
    {
        return this._xAxis.getPosX( opt );
    }

    _getAxisDataFrame( fields )
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

    removeField( field )
    {
        this.enabledField( field );
    }

    addField( field )
    {
        this.enabledField( field );
    }

    enabledField( field )
    {
        this.setFieldEnabled( field );
        var fieldMap = this.getFieldMapOf(field);
        var enabledFields = this.getEnabledFields()[ fieldMap.yAxis.align ];

        fieldMap.yAxis.resetData( this._getAxisDataFrame( enabledFields ) );

        //然后yAxis更新后，对应的背景也要更新
        this._grid.reset({
            animation:false,
            xAxis: {
                data: this._yAxisLeft.layoutData
            }
        });
    }

    //查询field在哪个yAxis上面,外部查询的话直接用fieldMap._yAxis
    _getYaxisOfField( field )
    {
        var me = this;
        var Axis;
        _.each( this._yAxis , function( _yAxis , i ){
            var fs = _yAxis.field;
            var _fs = _.flatten( [fs] );
            var ind = _.indexOf( _fs , field );
            if( ind >-1 ){
                //那么说明这个yAxis轴上面有这个字段，这个yaxis需要reset
                Axis = _yAxis;
                return false;
            }
        } );
        return Axis;
    }

    //和原始field结构保持一致，但是对应的field换成 {field: , enabled:...}结构
    _setFieldsMap()
    {
        var me = this;
        var fieldInd = 0;

        function _set( fields ){
            if(!fields){
                var yAxis = me.yAxis;
                if( !_.isArray( yAxis ) ){
                    yAxis = [yAxis];
                };
    
                fields = [];
    
                _.each( yAxis, function( item, i ){
                    fields = fields.concat( item.field );
                } );
            };
    
            if( _.isString(fields) ){
                fields = [fields];
            };

            var clone_fields = _.clone( fields );
            for(var i = 0 , l=fields.length ; i<l ; i++) {
                if( _.isString( fields[i] ) ){
                    clone_fields[i] = {
                        field : fields[i],
                        enabled : true,
                        yAxis : me._getYaxisOfField( fields[i] ),
                        style : themeColors[ fieldInd ],
                        ind : fieldInd++
                    }
                }
                if( _.isArray( fields[i] ) ){
                    clone_fields[i] = _set( fields[i], fieldInd );
                }
            };

            return clone_fields;
        };

        return _set();
    }

    //从 fieldsMap 中过滤筛选出来一个一一对应的 enabled为true的对象结构
    //这个方法还必须要返回的数据里描述出来多y轴的结构。否则外面拿到数据后并不好处理那个数据对应哪个轴
    getEnabledFields( )
    {
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
