import Component from "../component"
import Canvax from "canvax"
import { _ , getDefaultProps} from "mmvis"

const Line = Canvax.Shapes.Line

export default class barTgi extends Component
{
    static defaultProps(){
        return {
            field : {
                detail : '字段配置',
                default: null
            },
            barField : {
                detail: '这个bartgi组件对应的bar Graph 的field',
                default: null
            },
            yAxisAlign : {
                detail : '这个bartgi组件回到到哪个y轴',
                default: 'left'
            },
            standardVal : {
                detail : 'tgi标准线',
                default: 100
            },
            line : {
                detail : 'bar对应的tgi线配置',
                propertys : {
                    lineWidth : {
                        detail : '线宽',
                        default : 3
                    },
                    strokeStyle : {
                        detail : '线颜色',
                        default : function( val, i ){
                            if( val >= this.standardVal ){
                                return "#43cbb5"
                            } else {
                                return "#ff6060"
                            }
                        }
                    }
                }
            }
        }
    }
    
    constructor( opt, app )
    {
        super(opt, app);
        this.name = "barTgi";

        //this.field = null;
        //this.barField = null;

        this.data = null;
        this.barDatas = null;
        this._yAxis = null;

        //this.yAxisAlign = "left";

        this.sprite = null;

        //this.standardVal = 100;
        this.pos = {
            x : 0,
            y : 0
        };

        /*
        this.line = {
            lineWidth : 3,
            strokeStyle : function( val, i ){
                if( val >= this.standardVal ){
                    return "#43cbb5"
                } else {
                    return "#ff6060"
                }
            }
        };
        */

        
        _.extend( true, this, getDefaultProps( barTgi.defaultProps() ), opt );
        
        this._yAxis = this.app.getComponent({name:'coord'})._yAxis[ this.yAxisAlign=="left"?0:1 ];
        this.sprite  = new Canvax.Display.Sprite();
        this.app.graphsSprite.addChild( this.sprite );
    }

    reset( opt )
    {
        _.extend(true, this , opt );
        this.barDatas = null;
        this.data = null;
        this.sprite.removeAllChildren();
        this.draw();
    }

    draw()
    {
        var me = this;

        var _coord = this.app.getComponent({name:'coord'});
        this.pos = {   
            x: _coord.origin.x,
            y: _coord.origin.y
        };
        this.setPosition();

        _.each( me.app.getComponents({name:'graphs'}), function( _g ){
            if( _g.type == "bar" && _g.data[ me.barField ] ){
                me.barDatas = _g.data[ me.barField ];
                return false;
            }
        } );
        this.data = _.flatten( me.app.dataFrame.getDataOrg( me.field ) );

        if( !this.barDatas ) {
            return;
        };

        _.each( this.data, function( tgi, i ){
            var y = -me._yAxis.getPosOfVal( tgi );
            var barData = me.barDatas[ i ];

            var _tgiLine = new Line({
                context: {
                    start : {
                        x : barData.x,
                        y : y
                    },
                    end : {
                        x : barData.x + barData.width,
                        y : y
                    },
                    lineWidth: 2,
                    strokeStyle: me._getProp( me.line.strokeStyle, tgi, i )
                }
            });
            me.sprite.addChild( _tgiLine );
        } );
    }

    _getProp( val , tgi, i)
    {
        var res = val;
        if( _.isFunction( val ) ){
            res = val.apply( this, [ tgi, i ] )
        };
        return res;
    }
}