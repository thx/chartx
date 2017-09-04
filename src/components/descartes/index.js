import Component from "../component"
import Canvax from "canvax2d"
import xAxisConstructor from "../xaxis/index"
import yAxisConstructor from "../yaxis/index"
import Back from "../back/index"

export default class Descartes extends Component
{
	constructor( opt , root )
	{
		super();

		this._root  = root;

        this._xAxis = null;
        this._yAxis = [];

        this._yAxisLeft = null;
        this._yAxisRight = null;
        this._back  = null;

        this.graphsW = 0;
        this.graphsH = 0;
        this.graphsX = 0;
        this.graphsY = 0;

        //所有yAxis的fields 打平后的集合
        this.yAxisFields = [];

        this.dataFrame = this._root.dataFrame;

        this.init(opt);
	}

	init(opt)
	{
        var me = this;
        _.deepExtend(this, opt);
        me.sprite = new Canvax.Display.Sprite({
            id : "coordinate"
        });
        me._initModules();
    }

    //@opt --> coordinate节点配置
    reset( opt, dataFrame )
    {
        var me = this;
        !opt && ( opt = {} );
        _.deepExtend(this, opt);
        this.dataFrame = dataFrame;

        var _xAxisDataFrame = this._getXaxisDataFrame(this.xAxis.field);
        this._xAxis.reset( opt.xAxis , _xAxisDataFrame );

        var newYaxisFields = [];

        _.each( this._yAxis , function( _yAxis ){
            //这个_yAxis是具体的y轴实例
            var yAxisDataFrame = me._getYaxisDataFrame( _yAxis.field );
            var _opt = {};

            if( opt && opt.yAxis ){
                //TODO: 其实这个场景很少的，一般都是resetData
                //说明reset有配置的修改
                var yAxis = opt.yAxis;
                if( !_.isArray( yAxis ) ){
                    yAxis = [ yAxis ];
                };

                if( _yAxis.place == "left" ){
                    //当前是left的话，要从opt里面找到对应的配置
                    _opt = _.find( yAxis , function( ya ){
                        return ya.place == "left"
                    } ) || yAxis[0];
                } else {
                    //当前是right的话
                    _opt = _.find( yAxis , function( ya ){
                        return ya.place == "right"
                    } ) || yAxis[1];
                }

                if( _opt.field ){
                    //有配置新的field进来的话，就说明要切换字段了
                    newYaxisFields = newYaxisFields.concat( _.flatten( [_opt.field] ) );

                    //那么 dataFrame 也要重新获取
                    yAxisDataFrame = me._getYaxisDataFrame( _opt.field );
                }
            };
            
            _yAxis.reset( _opt, yAxisDataFrame );

            if( newYaxisFields.length > 0 ){
                me.yAxisFields = newYaxisFields;
            }
        } );

    }

    draw( opt )
    {
        var _padding = this._root.padding;
        var h = this._root.height;
        var w = this._root.width;

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
        this._back.draw({
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
    }
   
    _initModules()
    {

        var _xAxisDataFrame = this._getXaxisDataFrame(this.xAxis.field);
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
            return ya.place == "left"
        } ) || yAxis[0];
        yAxisLeft.place = "left";

        yAxisLeftDataFrame = this._getYaxisDataFrame( yAxisLeft.field );

        this.yAxisFields = _.flatten([ yAxisLeft.field ]);

        //如果过_yAxis配置是个数组，就说明要配置两个y轴对象，就是拥有左右双轴了
        if( yAxis.length > 1 ){
            yAxisRight = _.find( yAxis , function( ya ){
                return ya.place == "right"
            } ) || yAxis[1];

            yAxisRight.place = "right";
            yAxisRightDataFrame = this._getYaxisDataFrame( yAxisRight.field );
            this.yAxisFields = this.yAxisFields.concat( _.flatten([ yAxisRight.field ]) );
        };


        this._yAxisLeft = new yAxisConstructor( yAxisLeft, yAxisLeftDataFrame );
        this._yAxisLeft.axis = yAxisLeft;
        //不参与yDatasection的field， remove(field)的时候有用
        this._yAxisLeft.enabledFields = [];
        this.sprite.addChild( this._yAxisLeft.sprite );
        this._yAxis.push( this._yAxisLeft );

        if( yAxisRight ){
            this._yAxisRight = new yAxisConstructor( yAxisRight, yAxisRightDataFrame );
            this._yAxisRight.axis = yAxisRight;
            //不参与yDatasection的field， remove(field)的时候有用
            this._yAxisRight.enabledFields = [];
            this.sprite.addChild( this._yAxisRight.sprite );
            this._yAxis.push( this._yAxisRight );
        };

        this._back = new Back( this.back, this );
        this.sprite.addChild( this._back.sprite );
    }

    getPosX( opt ){
        return this._xAxis.getPosX( opt );
    }

    _getYaxisDataFrame( fields )
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

    _getXaxisDataFrame( fields )
    {
        return {
            field : fields,
            org : this.dataFrame.getDataOrg( fields )
        }
    }

    removeField( field )
    {
        var me = this;

        _.each( this._yAxis , function( _yAxis , i ){
            var fs = _yAxis.field;
            if( !_.isArray( fs ) ) {
                fs = [fs];
            };
            var _fs = _.flatten( fs );
            var ind = _.indexOf( _fs , field );
            if( ind >-1 ){
                //那么说明这个yAxis轴上面有这个字段，这个yaxis需要reset
                if( _.indexOf( _yAxis.enabledFields, field ) == -1 ){
                    _yAxis.enabledFields.push( field );
                };
                _fs = _.difference( _fs , _yAxis.enabledFields);
                _yAxis.reset( null , me._getYaxisDataFrame( _fs ));
            }
        } );

        //然后yAxis更新后，对应的背景也要更新
        this._back.update({
            xAxis: {
                data: this._yAxisLeft.layoutData
            }
        });
    }

    addField( field , targetYAxis )
    {

        var _yAxis = null;
        if( targetYAxis == "left"){
            _yAxis = this._yAxisLeft;
        };
        if( targetYAxis == "right"){
            _yAxis = this._yAxisRight;
        };

        var _fs = [];
        _.each( this._yAxis , function( _y , i ){
            var fs = _y.field;
            if( !_.isArray( fs ) ) {
                fs = [fs];
            };
            fs = _.flatten( fs );
            
            var ind = _.indexOf( fs , field );
            if( ind >-1 ){
                //那么说明这个yAxis轴上面有这个字段，这个yaxis需要reset
                _yAxis = _y;
                _fs = fs;
                return false;
            }
        } );

        if( !_yAxis ){
            //如果都没有找到，就默认把left作为被添加目标
            _yAxis = this._yAxisLeft;

            //同时，说明是新加的field，出来没有配置过的
            this.yAxisFields.push( field );
        };

        //找到了_yAxis后，如果它不在_yAxis的enabledFields里，就不需要做任何操作，说明当前已经在显示
        var ind = _.indexOf( _yAxis.enabledFields, field );
        if( ind == -1 ){
            return;
        } else {
            //需要update

            //先从禁用里面取消
            _yAxis.enabledFields.splice( ind, 1 );

            //然后重新设置该yAxisDataFrame
            _fs = _.difference( _fs , _yAxis.enabledFields);
            _yAxis.reset( null , this._getYaxisDataFrame( _fs ));
            
            //然后yAxis更新后，对应的背景也要更新,目前被添加到了left才需要updata back
            if( _yAxis.place == "left" ){
                this._back.update({
                    xAxis: {
                        data: this._yAxisLeft.layoutData
                    }
                });
            }
        }
    }
}
