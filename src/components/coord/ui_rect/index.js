import coorBase from "../ui_coord_base"
import Canvax from "canvax"
import xAxisConstructor from "./xaxis"
import yAxisConstructor from "./yaxis"
import Grid from "./grid"

const _ = Canvax._;
const Rect = Canvax.Shapes.Rect;

export default class Rect_Component extends coorBase
{
    constructor( opt, root )
    {
        super( opt, root );

        this.type = "rect";
        
        this._xAxis = null;
        this._yAxis = [];

        this._yAxisLeft = null;
        this._yAxisRight = null;
        this._grid  = null;

        this.horizontal = false;

        this.xAxis = {
            field : this.dataFrame.fields[0]
        };
        this.yAxis = [{
            field : this.dataFrame.fields.slice(1)
        }];
        this.grid = {
        };

        _.extend(true, this, opt);

        if( opt.horizontal ){
            this.xAxis.isH = true;
            _.each( this.yAxis , function( yAxis ){
                yAxis.isH = true;
            });
        };

        if( "enabled" in opt ){
            //如果有给直角坐标系做配置display，就直接通知到xAxis，yAxis，grid三个子组件
            _.extend( true, this.xAxis, {
                enabled : opt.enabled
            } );
            _.each( this.yAxis , function( yAxis ){
                _.extend( true, yAxis, {
                    enabled : opt.enabled
                } );
            });

            /*
            this.xAxis.enabled = opt.enabled;
            _.each( this.yAxis , function( yAxis ){
                yAxis.enabled = opt.enabled;
            });
            */
            
            this.grid.enabled = opt.enabled;
        };

        this.init(opt);
    }

    init(opt)
    {
        this.sprite = new Canvax.Display.Sprite({
            id : "coord"
        });
        this._initModules();
        //创建好了坐标系统后，设置 _fieldsDisplayMap 的值，
        // _fieldsDisplayMap 的结构里包含每个字段是否在显示状态的enabled 和 这个字段属于哪个yAxis
        this.fieldsMap = this._setFieldsMap();
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
            xDirection: {
                data: this._yAxisLeft.layoutData
            }
        });
    }

    draw( opt )
    {
        //在绘制的时候，要先拿到xAxis的高

        !opt && (opt ={});
        
        var _padding = this.root.padding;

        var h = opt.height || this.root.height;
        var w = opt.width || this.root.width;
        if( this.horizontal ){
            //如果是横向的坐标系统，也就是xy对调，那么高宽也要对调
            var _num = w;
            w = h;
            h = _num;
        };

        var y = h - this._xAxis.height - _padding.bottom;
        var _yAxisW = 0;
        var _yAxisRW = 0;

        //绘制yAxis
        if( this._yAxisLeft ){
            this._yAxisLeft.draw({
                pos: {
                    x: _padding.left,
                    y: y
                },
                yMaxHeight: y - _padding.top,
                resize : opt.resize
            });
            _yAxisW = this._yAxisLeft.width;
        }

        //如果有双轴
        if (this._yAxisRight) {
            this._yAxisRight.draw({
                pos: {
                    x : 0,
                    y : y
                },
                yMaxHeight: y - _padding.top,
                resize : opt.resize
            });
            _yAxisRW = this._yAxisRight.width;
        };

        //绘制x轴
        this._xAxis.draw({
            pos : {
                x : _padding.left + _yAxisW,
                y : y
            },
            width : w - _yAxisW - _padding.left - _yAxisRW - _padding.right,
            resize : opt.resize
        });
        
        this._yAxisRight && this._yAxisRight.setX( _yAxisW + _padding.left + this._xAxis.width );

        //绘制背景网格
        this._grid.draw({
            width   : this._xAxis.width,
            height  : this._yAxis[0].height,
            xDirection   : {
                data: this._yAxis[0].layoutData
            },
            yDirection   : {
                data: this._xAxis.layoutData
            },
            pos     : {
                x   : _yAxisW + _padding.left,
                y   : y
            },
            resize : opt.resize
        } );


        this.width = this._xAxis.width;
        this.height = this._yAxis[0].height;
        this.origin.x = _yAxisW + _padding.left;
        this.origin.y = y;

        this._initInduce();

        if( this.horizontal ){

            this._horizontal({
                w : w,
                h : h
            });

            /*
            var _padding = this.root.padding;
            this.width = this._yAxis[0].height;
            this.height = this._xAxis.width;
            this.origin.x = this._xAxis.height + _padding.left;
            this.origin.y = this._yAxis[0].height + _padding.top;
            */   
        }
    }

    getSizeAndOrigin(){
        var _padding = this.root.padding;
        var obj = {
            width : this.width,
            height : this.height,
            origin : this.origin
        };
        if( this.horizontal ){
            obj = {
                width : this._yAxis[0].height,
                height : this._xAxis.width,
                origin : {
                    x : this._xAxis.height + _padding.left,
                    y : this._yAxis[0].height + _padding.top
                }
            }
        };
        return obj;
    }

    _initModules()
    {
        this._grid = new Grid( this.grid, this );
        this.sprite.addChild( this._grid.sprite );

        var _xAxisDataFrame = this._getAxisDataFrame(this.xAxis.field);
        this._xAxis = new xAxisConstructor(this.xAxis, _xAxisDataFrame, this);
        this.sprite.addChild(this._xAxis.sprite);

        //这里定义的是配置
        var yAxis = this.yAxis;
        var yAxisLeft, yAxisRight;
        var yAxisLeftDataFrame, yAxisRightDataFrame;

        // yAxis 肯定是个数组
        if( !_.isArray( yAxis ) ){
            yAxis = [ yAxis ];
        };

        //left是一定有的
        yAxisLeft = _.find( yAxis , function( ya ){
            return ya.align == "left"
        } );
    
        if( yAxisLeft ){
            yAxisLeftDataFrame = this._getAxisDataFrame( yAxisLeft.field );
            this._yAxisLeft = new yAxisConstructor( yAxisLeft, yAxisLeftDataFrame );
            this._yAxisLeft.axis = yAxisLeft;
            this.sprite.addChild( this._yAxisLeft.sprite );
            this._yAxis.push( this._yAxisLeft );
        }
       
        yAxisRight = _.find( yAxis , function( ya ){
            return ya.align == "right"
        } );
        if( yAxisRight ){
            yAxisRightDataFrame = this._getAxisDataFrame( yAxisRight.field )
            this._yAxisRight = new yAxisConstructor( yAxisRight, yAxisRightDataFrame );
            this._yAxisRight.axis = yAxisRight;
            this.sprite.addChild( this._yAxisRight.sprite );
            this._yAxis.push( this._yAxisRight );
        };
    }

    /**
     * 
     * @param {x,y} size 
     */
    _horizontal( opt ) 
    {
        var me = this;
        var w = opt.h;
        var h = opt.w;
    
        _.each([me.sprite.context], function(ctx) {
            
            ctx.x += ((w - h) / 2);
            ctx.y += ((h - w) / 2);

            var origin = {
                x : h/2,
                y : w/2
            };

            ctx.rotation = 90;
            ctx.rotateOrigin = origin;

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

    //从 fieldsMap 中过滤筛选出来一个一一对应的 enabled为true的对象结构
    //这个方法还必须要返回的数据里描述出来多y轴的结构。否则外面拿到数据后并不好处理那个数据对应哪个轴
    getEnabledFields( fields )
    {
        if( fields ){
            //如果有传参数 fields 进来，那么就把这个指定的 fields 过滤掉 enabled==false的field
            //只留下enabled的field 结构
            return this.filterEnabledFields( fields );
        };

        var fmap = {
            left: [], right:[]
        };

        _.each( this.fieldsMap, function( bamboo, b ){
            if( _.isArray( bamboo ) ){
                //多节竹子，堆叠

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

    //由coor_base中得addField removeField来调用
    changeFieldEnabled( field )
    {
        this.setFieldEnabled( field );
        var fieldMap = this.getFieldMapOf(field);
        var enabledFields = this.getEnabledFields()[ fieldMap.yAxis.align ];
        fieldMap.yAxis.resetData( this._getAxisDataFrame( enabledFields ) );

        //然后yAxis更新后，对应的背景也要更新
        this._grid.reset({
            animation:false,
            xDirection: {
                data: this._yAxisLeft ? this._yAxisLeft.layoutData : this._yAxisRight.layoutData
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
                    if( item.field ){
                        fields = fields.concat( item.field );
                    };
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
                        color : me.root.getTheme(fieldInd),
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

    _initInduce()
    {
        var me = this;
        me.induce = new Rect({
            id: "induce",
            context: {
                x: me.origin.x,
                y: me.origin.y-me.height,
                width: me.width,
                height: me.height,
                fillStyle: '#000000',
                globalAlpha: 0,
                cursor: 'pointer'
            }
        });

        if( !me.sprite.getChildById("induce") ){
            me.sprite.addChild(me.induce);
        };
        
        me.induce.on("panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {
            //e.eventInfo = me._getInfoHandler(e);
            me.fire( e.type, e );
            //图表触发，用来处理Tips
            me.root.fire( e.type, e );
        })
    }

    getTipsInfoHandler( e )
    {
        //这里只获取xAxis的刻度信息;
        var induceX = e.point.x;
        if( e.target !== this.induce ){
            induceX = this.induce.globalToLocal( e.target.localToGlobal( e.point ) ).x
        };

        var xNode = this._xAxis.getNodeInfoOfX( induceX );
        
        var obj = {
            xAxis : xNode,
            title : xNode.text,
            nodes : [
                //遍历_graphs 去拿东西
            ]
        };

        if( e.eventInfo ){
            obj = _.extend(obj, e.eventInfo);

            //把xNode信息写到eventInfo上面
            if( obj.xAxis ){
                e.eventInfo.xAxis = xNode
            };
        };

        return obj;
    }
}