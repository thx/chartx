import coordBase from "./index"
import Canvax from "canvax"
import xAxisConstructor from "./xaxis"
import yAxisConstructor from "./yaxis"
import Grid from "./grid"
import { _,getDefaultProps,event } from "mmvis"


export default class Rect extends coordBase
{
    static defaultProps(){
        return {
            horizontal : {
                detail : '横向翻转坐标系',
                documentation : "横向翻转坐标系",
                insertText    : "horizontal: ",
                default       : false,
                values        : [true, false]
            },
            _props : {
                xAxis : xAxisConstructor,
                yAxis : yAxisConstructor,
                grid  : Grid
            }
        };
    }

    constructor( opt, app )
    {
        
        super( opt, app );
        _.extend( true, this, getDefaultProps( Rect.defaultProps() ), this.setDefaultOpt( opt, app ) );
        
        this.type = "rect";
        
        this._xAxis = null;
        this._yAxis = [];

        this._yAxisLeft = null;
        this._yAxisRight = null;
        this._grid  = null;

        this.init(opt);
    }

    setDefaultOpt( coordOpt, app )
    {
        var coord = {
            field : this.dataFrame.fields[0],
            xAxis : {
                //波峰波谷布局模型，默认是柱状图的，折线图种需要做覆盖
                layoutType    : "rule", //"peak",  
                //默认为false，x轴的计量是否需要取整， 这样 比如某些情况下得柱状图的柱子间隔才均匀。
                //比如一像素间隔的柱状图，如果需要精确的绘制出来每个柱子的间距是1px， 就必须要把这里设置为true
                posParseToInt : false
            },
            grid : {

            }
        };

        _.extend( true, coord, coordOpt );

        if( coord.yAxis ){
            var _nyarr = [];
            //TODO: 因为我们的deep extend 对于数组是整个对象引用过去，所以，这里需要
            //把每个子元素单独clone一遍，恩恩恩， 在canvax中优化extend对于array的处理
            _.each( _.flatten([coord.yAxis]) , function( yopt ){
                _nyarr.push( _.clone( yopt ) );
            } );
            coord.yAxis = _nyarr;
        } else {
            coord.yAxis = [];
        };

        //根据opt中得Graphs配置，来设置 coord.yAxis
        var graphsArr = _.flatten( [app._opt.graphs] );
        
        //有graphs的就要用找到这个graphs.field来设置coord.yAxis
        for( var i=0; i<graphsArr.length; i++ ){
            var graphs = graphsArr[i];
            if( graphs.type == "bar" ){
                //如果graphs里面有柱状图，那么就整个xAxis都强制使用 peak 的layoutType
                coord.xAxis.layoutType = "peak";
            }
            if( graphs.field ){
                //没有配置field的话就不绘制这个 graphs了
                var align = "left"; //默认left
                if( graphs.yAxisAlign == "right" ){
                    align = "right";
                };

                var optsYaxisObj = null;
                optsYaxisObj = _.find( coord.yAxis, function( obj, i ){
                    return obj.align == align || ( !obj.align && i == ( align == "left" ? 0 : 1 ));
                } );

                if( !optsYaxisObj ){
                    optsYaxisObj = {
                        align : align,
                        field : []
                    }
                    coord.yAxis.push( optsYaxisObj );
                } else {
                    if( !optsYaxisObj.align ){
                        optsYaxisObj.align = align;
                    }
                }

                if( !optsYaxisObj.field ){
                    optsYaxisObj.field = [];
                } else {
                    if( !_.isArray( optsYaxisObj.field ) ){
                        optsYaxisObj.field = [ optsYaxisObj.field ];
                    }
                }

                if( _.isArray( graphs.field ) ){
                    optsYaxisObj.field = optsYaxisObj.field.concat( graphs.field )
                } else {
                    optsYaxisObj.field.push( graphs.field )
                }
                    
            }
        };
        
        //再梳理一遍yAxis，get没有align的手动配置上align
        //要手动把yAxis 按照 left , right的顺序做次排序
        var _lys=[],_rys=[];
        _.each( coord.yAxis , function( yAxis , i ){
            if( !yAxis.align ){
                yAxis.align = i ?"right": "left";
            }
            if( yAxis.align == "left" ){
                _lys.push( yAxis );
            } else {
                _rys.push( yAxis );
            }
        } );
        coord.yAxis = _lys.concat( _rys );

        if( coord.horizontal ){
            coord.xAxis.isH = true;
            _.each( coord.yAxis , function( yAxis ){
                yAxis.isH = true;
            });
        };

        if( "enabled" in coord ){
            //如果有给直角坐标系做配置display，就直接通知到xAxis，yAxis，grid三个子组件
            _.extend( true, coord.xAxis, {
                enabled : coord.enabled
            } );
            _.each( coord.yAxis , function( yAxis ){
                _.extend( true, yAxis, {
                    enabled : coord.enabled
                } );
            });
            coord.grid.enabled = coord.enabled;
        };
        
        return coord;
    }

    init(opt)
    {

        this._initModules();
        //创建好了坐标系统后，设置 _fieldsDisplayMap 的值，
        // _fieldsDisplayMap 的结构里包含每个字段是否在显示状态的enabled 和 这个字段属于哪个yAxis
        this.fieldsMap = this.setFieldsMap( {type: "yAxis"} );
    }

    resetData( dataFrame , dataTrigger )
    {
        var me = this;
        this.dataFrame = dataFrame;

        var _xAxisDataFrame = this.getAxisDataFrame(this.xAxis.field);
        this._xAxis.resetData( _xAxisDataFrame );

        _.each( this._yAxis , function( _yAxis ){
            //这个_yAxis是具体的y轴实例
            var yAxisDataFrame = me.getAxisDataFrame( _yAxis.field );
            _yAxis.resetData( yAxisDataFrame );
        } );

        this._resetXY_axisLine_pos();

        var _yAxis = this._yAxisLeft || this._yAxisRight;
        this._grid.reset({
            animation:false,
            xDirection: {
                data: _yAxis.layoutData
            }
        });
    }

    draw( opt )
    {
        //在绘制的时候，要先拿到xAxis的高

        !opt && (opt ={});
        
        var _padding = this.app.padding;

        var h = opt.height || this.app.height;
        var w = opt.width || this.app.width;
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
            width        : this._xAxis.width,
            height       : this._yAxis[0].height,
            oneDimension : {
                data     : this._yAxis[0].layoutData
            },
            towDimension : {
                data     : this._xAxis.layoutData
            },
            pos          : {
                x        : _yAxisW + _padding.left,
                y        : y
            },
            resize       : opt.resize
        } );


        this.width = this._xAxis.width;
        this.height = this._yAxis[0].height;
        this.origin.x = _yAxisW + _padding.left;
        this.origin.y = y;

        this._initInduce();

        this._resetXY_axisLine_pos();

        if( this.horizontal ){

            this._horizontal({
                w : w,
                h : h
            });

            /*
            var _padding = this.app.padding;
            this.width = this._yAxis[0].height;
            this.height = this._xAxis.width;
            this.origin.x = this._xAxis.height + _padding.left;
            this.origin.y = this._yAxis[0].height + _padding.top;
            */   
        }
    }

    _resetXY_axisLine_pos(){
        var me = this;
        //设置下x y 轴的 _axisLine轴线的位置，默认 axisLine.position==default

        var xAxisPosY;
        if( this._xAxis.axisLine.position == 'center' ){
            xAxisPosY = -this._yAxis[0].height / 2;
        } 
        if( this._xAxis.axisLine.position == 'center' ){
            xAxisPosY = -this._yAxis[0].height / 2;
        } 
        if( _.isNumber( this._xAxis.axisLine.position ) ){
            xAxisPosY = -this._yAxis[0].getPosOfVal( this._xAxis.axisLine.position );
        }
        if( xAxisPosY !== undefined ){
            this._xAxis._axisLine.context.y = xAxisPosY;
        }

        _.each( this._yAxis , function( _yAxis ){
            //这个_yAxis是具体的y轴实例
            var yAxisPosX;
            if( _yAxis.axisLine.position == 'center' ){
                yAxisPosX = me._xAxis.width / 2;
            }; 
            if( _.isNumber( _yAxis.axisLine.position ) ){
                yAxisPosX = me._xAxis.getPosOfVal( _yAxis.axisLine.position );
            };
            if( yAxisPosX !== undefined ){
                _yAxis._axisLine.context.x = yAxisPosX;
            };
        } );

    }

    getSizeAndOrigin(){
        
        var obj = {
            width : this.width,
            height : this.height,
            origin : this.origin
        };
        if( this.horizontal ){
            var _padding = this.app.padding;
            //因为在drawBeginHorizontal中
            //横向了之后， 要把4个padding值轮换换过了
            //top,right 对调 ， bottom,left 对调
            //所以，这里要对调换回来给到origin
            var left = _padding.bottom;
            var top = _padding.right;
            obj = {
                width : this._yAxis[0].height,
                height : this._xAxis.width,
                origin : {
                    x : this._xAxis.height + left,
                    y : this._yAxis[0].height + top
                }
            }
        };
        return obj;
    }

    _initModules()
    {
        this._grid = new Grid( this.grid, this );
        this.sprite.addChild( this._grid.sprite );

        var _xAxisDataFrame = this.getAxisDataFrame(this.xAxis.field);
        this._xAxis = new xAxisConstructor(this.xAxis, _xAxisDataFrame, this);
        this._axiss.push( this._xAxis );
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
            yAxisLeftDataFrame = this.getAxisDataFrame( yAxisLeft.field );
            this._yAxisLeft = new yAxisConstructor( yAxisLeft, yAxisLeftDataFrame );
            this._yAxisLeft.axis = yAxisLeft;
            this.sprite.addChild( this._yAxisLeft.sprite );
            this._yAxis.push( this._yAxisLeft );
            this._axiss.push( this._yAxisLeft );
        }
       
        yAxisRight = _.find( yAxis , function( ya ){
            return ya.align == "right"
        } );
        if( yAxisRight ){
            yAxisRightDataFrame = this.getAxisDataFrame( yAxisRight.field )
            this._yAxisRight = new yAxisConstructor( yAxisRight, yAxisRightDataFrame );
            this._yAxisRight.axis = yAxisRight;
            this.sprite.addChild( this._yAxisRight.sprite );
            this._yAxis.push( this._yAxisRight );
            this._axiss.push( this._yAxisRight );
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

    

    //由coor_base中得addField removeField来调用
    changeFieldEnabled( field )
    {
        
        this.setFieldEnabled( field );
        
        var fieldMap = this.getFieldMapOf(field);
        var _axis = fieldMap.yAxis || fieldMap.rAxis;
        
        var enabledFields = this.getEnabledFieldsOf( _axis )//[ fieldMap.yAxis.align ];
        
        _axis.resetData( this.getAxisDataFrame( enabledFields ) );
        this._resetXY_axisLine_pos();

        //然后yAxis更新后，对应的背景也要更新
        this._grid.reset({
            animation:false,
            xDirection: {
                data: this._yAxisLeft ? this._yAxisLeft.layoutData : this._yAxisRight.layoutData
            }
        });
    }


    _initInduce()
    {
        var me = this;
        me.induce = new Canvax.Shapes.Rect({
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
        
        me.induce.on(event.types.get(), function(e) {
            //e.eventInfo = me._getInfoHandler(e);
            me.fire( e.type, e );
            //图表触发，用来处理Tips
            me.app.fire( e.type, e );
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

            //下面两个属性是所有坐标系统一的
            iNode : xNode.ind,
            nodes : [
                //遍历_graphs 去拿东西
            ]
        };

        if( e.eventInfo ){
            _.extend(true, obj, e.eventInfo);

            //把xNode信息写到eventInfo上面
            if( obj.xAxis ){
                e.eventInfo.xAxis = xNode
            };
        };

        return obj;
    }




    //下面的方法是所有坐标系都要提供的方法，用来计算位置的， graphs里面会调用
    //return {pos {x,y}, value :{x,y}}
    getPoint( opt ){
        var point = {
            x : 0,
            y : undefined
        };

        var xaxisExp = {
            type : "xAxis"
        };
        var yaxisExp = {
            type : "yAxis", 
            field : opt.field
        };
        var _xAxis = this.getAxis( xaxisExp );
        var _yAxis = this.getAxis( yaxisExp );

        var _iNode = opt.iNode || 0;

        var _value = opt.value; //x y 一般至少会带 yval过来

        if( !("x" in _value) ){
            //如果没有传xval过来，要用iNode去xAxis的org去取
            _value.x = _.flatten( _xAxis.dataOrg )[ _iNode ];
        };
        point.x = _xAxis.getPosOf({ ind: _iNode, val: _value.x });

        var y = _value.y;
        if( !isNaN( y ) && y !== null && y !== undefined && y !== ""  ){
            point.y = -_yAxis.getPosOfVal( y );
        } else {
            point.y = undefined;
        };

        return {
            pos : point,
            value : _value
        };

    }

    getAxisOriginPoint( exp ){
        var _yAxis = this.getAxis( exp );
        return {
            pos : -_yAxis.originPos,
            value : _yAxis.origin
        }
    }

    getOriginPos( exp ){
        var xaxisExp = {
            type : "xAxis"
        };
        var yaxisExp = {
            type : "yAxis", 
            field : exp.field
        };
        var _xAxis = this.getAxis( xaxisExp );
        var _yAxis = this.getAxis( yaxisExp );
        return {
            x : _xAxis.originPos,
            y : -_yAxis.originPos
        }
    }

}